// migrations/[timestamp]-add-property-type-specific-fields.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check existing columns to avoid duplicates
    const tableDescription = await queryInterface.describeTable('properties');
    
    // Add propertyType to properties
    if (!tableDescription.propertyType) {
      await queryInterface.addColumn('properties', 'propertyType', {
        type: Sequelize.ENUM('residential', 'land', 'commercial', 'commercial-land', 'farmhouse', 'studio', 'pg'),
        allowNull: true
      });
    }

    // Land specific fields - check if they already exist
    if (!tableDescription.plotArea) {
      await queryInterface.addColumn('properties', 'plotArea', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.plotLength) {
      await queryInterface.addColumn('properties', 'plotLength', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.plotBreadth) {
      await queryInterface.addColumn('properties', 'plotBreadth', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.plotFacing) {
      await queryInterface.addColumn('properties', 'plotFacing', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableDescription.roadWidth) {
      await queryInterface.addColumn('properties', 'roadWidth', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.openSides) {
      await queryInterface.addColumn('properties', 'openSides', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Commercial specific
    if (!tableDescription.washrooms) {
      await queryInterface.addColumn('properties', 'washrooms', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.frontage) {
      await queryInterface.addColumn('properties', 'frontage', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    // Farmhouse specific
    if (!tableDescription.totalArea) {
      await queryInterface.addColumn('properties', 'totalArea', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    }
    
    if (!tableDescription.openArea) {
      await queryInterface.addColumn('properties', 'openArea', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    // PG specific
    if (!tableDescription.sharingType) {
      await queryInterface.addColumn('properties', 'sharingType', {
        type: Sequelize.ENUM('Single', 'Double', 'Triple', 'Four or More'),
        allowNull: true
      });
    }
    
    if (!tableDescription.totalBeds) {
      await queryInterface.addColumn('properties', 'totalBeds', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.availableBeds) {
      await queryInterface.addColumn('properties', 'availableBeds', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableDescription.gateClosingTime) {
      await queryInterface.addColumn('properties', 'gateClosingTime', {
        type: Sequelize.TIME,
        allowNull: true
      });
    }
    
    if (!tableDescription.visitorPolicy) {
      await queryInterface.addColumn('properties', 'visitorPolicy', {
        type: Sequelize.ENUM('Not Allowed', 'Limited Hours', 'Allowed'),
        allowNull: true
      });
    }
    
    if (!tableDescription.noticePeriod) {
      await queryInterface.addColumn('properties', 'noticePeriod', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    // Additional fields
    if (!tableDescription.zoning) {
      await queryInterface.addColumn('properties', 'zoning', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableDescription.approvedUse) {
      await queryInterface.addColumn('properties', 'approvedUse', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all columns in reverse order
    await queryInterface.removeColumn('properties', 'approvedUse');
    await queryInterface.removeColumn('properties', 'zoning');
    await queryInterface.removeColumn('properties', 'noticePeriod');
    await queryInterface.removeColumn('properties', 'visitorPolicy');
    await queryInterface.removeColumn('properties', 'gateClosingTime');
    await queryInterface.removeColumn('properties', 'availableBeds');
    await queryInterface.removeColumn('properties', 'totalBeds');
    await queryInterface.removeColumn('properties', 'sharingType');
    await queryInterface.removeColumn('properties', 'openArea');
    await queryInterface.removeColumn('properties', 'totalArea');
    await queryInterface.removeColumn('properties', 'frontage');
    await queryInterface.removeColumn('properties', 'washrooms');
    await queryInterface.removeColumn('properties', 'openSides');
    await queryInterface.removeColumn('properties', 'roadWidth');
    await queryInterface.removeColumn('properties', 'plotFacing');
    await queryInterface.removeColumn('properties', 'plotBreadth');
    await queryInterface.removeColumn('properties', 'plotLength');
    await queryInterface.removeColumn('properties', 'plotArea');
    await queryInterface.removeColumn('properties', 'propertyType');
    
    // Drop ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_properties_propertyType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_properties_sharingType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_properties_visitorPolicy";');
  }
};
