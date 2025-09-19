// migrations/[timestamp]-add-propertyType-to-subcategories.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subcategories', 'propertyType', {
      type: Sequelize.ENUM('residential', 'land', 'commercial', 'commercial-land', 'farmhouse', 'studio', 'pg'),
      defaultValue: 'residential',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subcategories', 'propertyType');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_subcategories_propertyType";');
  }
};