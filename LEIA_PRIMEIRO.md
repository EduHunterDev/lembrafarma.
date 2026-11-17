# LembraFarma integrado — instalação no Windows

Este pacote foi corrigido usando as tecnologias já presentes no projeto: **React 18 + Vite 6 no frontend**, **Node.js + Express 5 + Sequelize 6 na API**, **MySQL 8 no ambiente local**. O frontend foi colocado na pasta `LembraFarma`, e todo o código de backend está na pasta `lembrafarma_api`.

## Antes de iniciar

1. Instale **Node.js 20.17 ou superior** (recomendado Node.js 22 LTS) e **MySQL Server 8**. O MySQL Workbench é apenas a interface de administração: o *servidor* MySQL precisa estar instalado e em execução.
2. Abra o MySQL Workbench e conecte-se ao MySQL Server. Execute **apenas este SQL** para criar um banco vazio (ajuste o nome ao `DB_NAME` se necessário):

```sql
CREATE DATABASE IF NOT EXISTS lembrafarma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

3. Edite `lembrafarma_api/.env` e confira:

```dotenv
NODE_ENV=development
PORT=3000
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=lembrafarma
DB_USER=root
DB_PASSWORD=SUA_SENHA_REAL_DO_MYSQL
DB_SSL=false
JWT_SECRET=COLOQUE_UM_SEGREDO_UNICO_LONGO_E_ALEATORIO
```

O `.env` do pacote veio do arquivo original, caso existisse. **Não publique esse arquivo:** ele contém credenciais. `.gitignore` o protege de commits normais, mas não de uploads manuais. O arquivo `.env.example` é somente um exemplo sem credenciais reais.

## Instalação rápida

Com o banco criado e o `.env` configurado:

- Execute **`INSTALAR_WINDOWS.bat`**: instala as dependências com `npm ci` e aplica as migrations do Sequelize.
- Execute **`INICIAR_WINDOWS.bat`**: inicia a API em **http://localhost:3000** e o frontend em **http://localhost:5173**.
- Abra **http://localhost:5173** no navegador. Vá em Cadastro, crie a conta da farmácia, faça login, cadastre cliente, registre compra e consulte o painel e alertas.
- Para testar a conexão real com o banco, com os servidores rodando, execute `VERIFICAR_API_WINDOWS.bat` ou abra **http://localhost:3000/api/health**. O retorno deverá incluir `"status":"ok"`.
- Execute **`TESTAR_WINDOWS.bat`** para testar os fluxos automatizados (os testes utilizam SQLite temporário, não alteram seu banco MySQL).

Se preferir executar pelo terminal (PowerShell ou CMD na pasta raiz):

```powershell
npm --prefix .\lembrafarma_api ci
npm --prefix .\LembraFarma ci
npm --prefix .\lembrafarma_api run db:migrate
npm --prefix .\LembraFarma run dev
```

**Não execute o `database/ddl.sql` nem os seeders em um schema que usará as migrations**. Não apague o banco antigo. Se o banco já contém tabelas criadas fora das migrations, faça um backup e use um banco vazio para iniciar, ou concilie o histórico das migrations antes de aplicar alterações.

## O que passou a usar o MySQL

| Funcionalidade | Integração |
| --- | --- |
| Cadastro e login de farmácias | `/api/usuarios`, `/api/usuarios/login` — JWT e senha com hash |
| Perfil, foto e mudança de senha | `/api/perfil`, `/api/me/profile`, `/api/me/password` |
| Cadastro e listagem de clientes | `/api/clientes` — endereços nos campos SQL corretos |
| Compras | `/api/compras` — transação única para pedido, item e alerta |
| Próximas recompras e dashboard | Dados de compras e clientes retornados pela API |
| Alertas | Persistidos na tabela `alertas`; interface mostra as próximas 72 horas por data de calendário (hoje e próximos 3 dias) |
| Cadastro/consulta/edição/exclusão de medicamentos | `/api/medicamentos`, nova tabela `medicamentos` |

**Arquitetura:** o frontend chama URLs relativas a `/api`. O proxy do Vite encaminha ao Express na porta 3000; não existem mais servidores concorrentes nas portas 3000 e 3001. O MySQL é a fonte principal dos dados. O navegador mantém apenas caches de interface, não finge sucesso quando o banco falha.

## Dados antigos guardados no navegador

Versões anteriores gravavam clientes, compras e medicamentos em `localStorage`, que **não estava no MySQL**. Esses dados não estão dentro do ZIP nem podem ser obtidos do seu computador. Na primeira sincronização, as entradas antigas que ainda existirem no navegador são preservadas em chaves com sufixo `::backup` antes de substituir os caches pelos registros do banco. Essa cópia é **apenas de segurança**, não faz importação automática, para não duplicar clientes e compras. Faça backup do perfil do navegador e exporte/importe os dados antigos com cuidado se precisar migrá-los. Nunca apague o armazenamento local antes de resgatar esses backups.

## O que requer configuração adicional

- **MySQL real:** para verificar a instalação local, é obrigatório que o MySQL Server esteja iniciado e que o `.env` esteja correto. O banco real do usuário não pôde ser acessado durante a correção.
- **Consulta externa de medicamentos:** ainda precisa de uma chave válida de `medicamentos.api.br` e de acesso à internet/CORS concedido pelo provedor. Os cadastros realizados dentro do sistema passam a persistir no MySQL.
- **WhatsApp:** o botão abre uma conversa com a mensagem preenchida. O envio é **manual**; não há integração oficial para disparo automático nem confirmação automática de entrega.
- **Planos e recuperação de senha por e-mail:** cobrança recorrente e SMTP não estavam implementados no projeto original. A página de planos informa essa limitação; a troca de senha com a senha atual funciona em Configurações.
- **Produção:** antes de publicar na internet configure HTTPS, proteção contra brute force, backups do MySQL, políticas de privacidade/LGPD, monitoramento e hospedagem segura. Não use as credenciais locais do `.env` em repositórios públicos.

## Produção local (API servindo o build do frontend)

```powershell
npm --prefix .\LembraFarma run build
npm --prefix .\lembrafarma_api run start
```

A API tentará servir automaticamente os arquivos `LembraFarma/dist`, caso existam. Acesse **http://localhost:3000** (sem Vite). Use `CTRL+C` para encerrar o servidor.

## Correção de problemas

- **`ECONNREFUSED` ou `SequelizeConnectionRefusedError`:** inicie MySQL Server em `services.msc`, confira host/porta. MySQL Workbench aberto sozinho não significa que o servidor está rodando.
- **`Access denied for user`:** confira `DB_USER`, `DB_PASSWORD` e permissões do schema.
- **`Unknown database`:** crie o schema com o mesmo nome do `DB_NAME` do `.env`.
- **`ER_TABLE_EXISTS_ERROR`:** as tabelas foram criadas manualmente ou em migrations antigas; faça backup e confira histórico do Sequelize. Não force `sync({ force: true })`, pois apaga dados.
- **`Failed to fetch` na página:** certifique-se de que API (3000) e Vite (5173) foram iniciados e que `/api/health` responde.
- **Não aparece cliente/compra antiga:** versões anteriores usavam dados locais; consulte as instruções de backup acima, sem executar limpeza do navegador.

## Validação feita na correção

- Testes Node do backend (CRUD original + fluxo completo novo) passaram usando SQLite isolado, com banco criado em memória.
- Testes Node do frontend para autenticação, mapeamentos da API e validações passaram.
- Sintaxe dos arquivos JavaScript/JSX foi analisada.
- **Não foi possível validar uma conexão MySQL real nem a construção Vite no ambiente Linux de testes**, pois o servidor MySQL local do usuário não estava disponível e o ZIP original continha binários de Vite/Rollup apenas para Windows. Execute `INSTALAR_WINDOWS.bat` na sua máquina para instalar os binários corretos e verificar o frontend em tempo de execução.
