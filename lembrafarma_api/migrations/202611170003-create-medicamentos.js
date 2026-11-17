'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medicamentos', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      usuario_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      cliente_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'clientes', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      dados: { type: Sequelize.TEXT('long'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.addIndex('medicamentos', ['usuario_id'], { name: 'idx_medicamentos_usuario' });
    await queryInterface.addIndex('medicamentos', ['cliente_id'], { name: 'idx_medicamentos_cliente' });
  },
  down: async queryInterface => { await queryInterface.dropTable('medicamentos'); }
};
