
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LembraFarma API',
      version: '1.0.0',
      description: 'Documentação da API do sistema LembraFarma.'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local'
      }
    ],
    components: { 
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', 
      }
  }
},
security: [
  {
    bearerAuth: []
  }
],
    tags: [
      { name: 'Usuários', description: 'Cadastro e login' },
      { name: 'Clientes', description: 'Gerenciamento de clientes' },
      { name: 'Pedidos', description: 'Gerenciamento de pedidos' },
      { name: 'Itens de pedidos', description: 'Itens dos pedidos' },
      { name: 'Alertas', description: 'Gerenciamento de alertas' },
      { name: 'Compras', description: 'Gerenciamento de compras' },
      { name: 'Medicamentos', description: 'Gerenciamento de medicamentos' },
      { name: 'Perfil', description: 'Dados do perfil do usuário' }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
