const express = require('express');
const cors = require('cors');
const db = require('./models');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const autenticar = require('./middlewares/autenticacao');
const comprasRoutes = require('./routes/comprasRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json({ limit: '3mb' }));
const api = express.Router();
api.use('/usuarios', usuarioRoutes);
api.use('/clientes', clienteRoutes);
api.use('/pedidos', pedidoRoutes);
api.use('/alertas', alertaRoutes);
api.use('/compras', comprasRoutes);
api.use('/medicamentos', medicamentoRoutes);
api.use('/me', perfilRoutes);
api.get('/perfil', autenticar, async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.usuario.id);
    if (!usuario || usuario.status !== 'ativo') return res.status(401).json({ mensagem: 'Conta indisponível.' });
    return res.json({ mensagem: 'Acesso autorizado!', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, foto: usuario.foto || '' } });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Falha ao consultar perfil.' });
  }
});

api.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    // Verifica também se as tabelas usadas pela interface já foram migradas.
    await Promise.all([
      db.Usuario.findOne({ attributes: ['id', 'foto'] }),
      db.Cliente.findOne({ attributes: ['id'] }),
      db.Pedido.findOne({ attributes: ['id'] }),
      db.ItemPedido.findOne({ attributes: ['id'] }),
      db.Alerta.findOne({ attributes: ['id'] }),
      db.Medicamento.findOne({ attributes: ['id'] })
    ]);
    res.status(200).json({
      status: 'ok',
      database: db.sequelize.getDatabaseName()
    });
  } catch (error) {
    console.error('Falha ao verificar conexão com banco:', error.name);
    res.status(500).json({
      status: 'error',
      message: 'Conexão ou migrations do banco não estão prontas'
    });
  }
});

// /api é o caminho público usado pelo frontend; rotas legadas são mantidas.
app.use('/api', api);
app.use('/', api);
const publicDir = path.resolve(__dirname, '../../LembraFarma/dist');
if (fs.existsSync(path.join(publicDir, 'index.html'))) {
  app.use(express.static(publicDir));
  app.get(/.*/, (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ mensagem: 'Rota da API não encontrada.' });
    return res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não está configurada.');
    process.exit(1);
  }

  db.sequelize
    .authenticate()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    })
    .catch((error) => {
      const detalhes = { tipo: error.name };
      if (error.original && error.original.code) {
        detalhes.codigo = error.original.code;
      }
      console.error('Falha ao conectar ao banco de dados:', detalhes);
      process.exit(1);
    });
}

module.exports = app;
