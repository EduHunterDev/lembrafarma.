# Correções realizadas — LembraFarma

## Integração

- **Frontend:** React 18 + Vite 6 na pasta `LembraFarma`.
- **Backend:** Node.js + Express 5 + Sequelize 6 na pasta `lembrafarma_api`.
- **Banco:** MySQL local, configurável em `lembrafarma_api/.env`. As migrations devem ser executadas após criar o schema vazio.
- **Comunicação:** todas as chamadas do frontend usam o prefixo `/api`; o Vite encaminha essas chamadas ao backend na porta 3000.

## Fluxos ajustados

- Cadastro e autenticação de usuário, recuperação do perfil, alteração de nome, foto e senha.
- Listagem e cadastro de clientes com campos compatíveis com as tabelas MySQL.
- Gravação de compras em pedido + item + alerta, usando uma transação SQL.
- Visualização de compras, alertas e números do dashboard a partir de dados da API.
- Cadastro, consulta, alteração e exclusão de medicamentos persistidos no banco.
- Isolamento de clientes, compras, alertas e medicamentos por conta autenticada.
- Estado de erro visível quando a API falha, sem registrar dados apenas no navegador e afirmar sucesso.
- Preservação de cópia dos dados antigos do navegador na primeira sincronização, sem importação automática.

## Validação

- **Backend:** 10 testes automatizados aprovados com SQLite temporário, incluindo um fluxo integrado de cadastro, compra, alerta, medicamento e perfil.
- **Frontend:** 14 testes automatizados aprovados.
- **Pendente no computador do usuário:** confirmar conexão ao MySQL Server real, aplicar migrations, instalar os binários npm próprios do Windows e validar o site pelo navegador. Estes testes precisam da infraestrutura local do usuário e não foram executados neste ambiente.

## Limitações explicitadas

- O botão de WhatsApp abre a conversa para **envio manual**; não há envio automático contratado.
- A pesquisa externa de medicamentos depende de chave válida e das condições do serviço.
- Cobrança recorrente de planos e redefinição de senha por e-mail não estavam implementadas e exigem integração adicional.

Consulte **`LEIA_PRIMEIRO.md`** para o roteiro completo de instalação e testes no Windows.
