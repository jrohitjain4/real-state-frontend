// migrations/[timestamp]-add-property-type-specific-features.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Land specific amenities
    await queryInterface.addColumn('property_features', 'boundaryWall', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'waterConnection', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'electricityConnection', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Commercial specific
    await queryInterface.addColumn('property_features', 'centralAC', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'cafeteria', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Farmhouse specific
    await queryInterface.addColumn('property_features', 'garden', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'servantQuarter', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'guestHouse', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'borewell', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // PG specific
    await queryInterface.addColumn('property_features', 'food', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('property_features', 'ac', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'wifi', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'laundry', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'housekeeping', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Additional features
    await queryInterface.addColumn('property_features', 'cornerProperty', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    await queryInterface.addColumn('property_features', 'mainRoadFacing', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all columns
    await queryInterface.removeColumn('property_features', 'mainRoadFacing');
    await queryInterface.removeColumn('property_features', 'cornerProperty');
    await queryInterface.removeColumn('property_features', 'housekeeping');
    await queryInterface.removeColumn('property_features', 'laundry');
    await queryInterface.removeColumn('property_features', 'wifi');
    await queryInterface.removeColumn('property_features', 'ac');
    await queryInterface.removeColumn('property_features', 'food');
    await queryInterface.removeColumn('property_features', 'borewell');
    await queryInterface.removeColumn('property_features', 'guestHouse');
    await queryInterface.removeColumn('property_features', 'servantQuarter');
    await queryInterface.removeColumn('property_features', 'garden');
    await queryInterface.removeColumn('property_features', 'cafeteria');
    await queryInterface.removeColumn('property_features', 'centralAC');
    await queryInterface.removeColumn('property_features', 'electricityConnection');
    await queryInterface.removeColumn('property_features', 'waterConnection');
    await queryInterface.removeColumn('property_features', 'boundaryWall');
  }
};