'use strict';
module.exports = {
  up: async queryInterface => {
    await queryInterface.removeIndex('clientes', 'uq_clientes_cpf');
    await queryInterface.addIndex('clientes', ['usuario_id', 'cpf'], { unique: true, name: 'uq_clientes_usuario_cpf' });
  },
  down: async queryInterface => {
    await queryInterface.removeIndex('clientes', 'uq_clientes_usuario_cpf');
    await queryInterface.addIndex('clientes', ['cpf'], { unique: true, name: 'uq_clientes_cpf' });
  }
};
