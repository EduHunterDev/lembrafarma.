'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'foto', { type: Sequelize.TEXT('long'), allowNull: true });
  },
  down: async queryInterface => { await queryInterface.removeColumn('usuarios', 'foto'); }
};
