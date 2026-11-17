'use strict';
module.exports = (sequelize, DataTypes) => {
  const Medicamento = sequelize.define('Medicamento', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    usuario_id: { type: DataTypes.BIGINT, allowNull: false },
    cliente_id: { type: DataTypes.BIGINT, allowNull: false },
    dados: { type: DataTypes.TEXT('long'), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'medicamentos', timestamps: true, indexes: [
    { name: 'idx_medicamentos_usuario', fields: ['usuario_id'] },
    { name: 'idx_medicamentos_cliente', fields: ['cliente_id'] }
  ] });
  Medicamento.associate = models => {
    Medicamento.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Medicamento.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
  };
  return Medicamento;
};
