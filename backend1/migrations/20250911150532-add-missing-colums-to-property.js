// Create migrations/009-add-remaining-property-columns.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDescription = await queryInterface.describeTable('properties');
        
        // Add maintenanceCharge if it doesn't exist
        if (!tableDescription.maintenanceCharge) {
            await queryInterface.addColumn('properties', 'maintenanceCharge', {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            });
        }
        
        // Add furnishingStatus if it doesn't exist
        if (!tableDescription.furnishingStatus) {
            await queryInterface.addColumn('properties', 'furnishingStatus', {
                type: Sequelize.ENUM('furnished', 'semi-furnished', 'unfurnished'),
                defaultValue: 'unfurnished'
            });
        }
        
        // Add possessionStatus if it doesn't exist
        if (!tableDescription.possessionStatus) {
            await queryInterface.addColumn('properties', 'possessionStatus', {
                type: Sequelize.ENUM('ready-to-move', 'under-construction'),
                defaultValue: 'ready-to-move'
            });
        }
        
        // Add availableFrom if it doesn't exist
        if (!tableDescription.availableFrom) {
            await queryInterface.addColumn('properties', 'availableFrom', {
                type: Sequelize.DATEONLY,
                defaultValue: Sequelize.NOW
            });
        }
        
        // Add ageOfProperty if it doesn't exist
        if (!tableDescription.ageOfProperty) {
            await queryInterface.addColumn('properties', 'ageOfProperty', {
                type: Sequelize.ENUM('new', '1-3years', '3-5years', '5-10years', '10plus'),
                defaultValue: 'new'
            });
        }
        
        // Add ownershipType if it doesn't exist
        if (!tableDescription.ownershipType) {
            await queryInterface.addColumn('properties', 'ownershipType', {
                type: Sequelize.ENUM('owner', 'dealer', 'builder'),
                defaultValue: 'owner'
            });
        }
        
        // Add viewCount if it doesn't exist
        if (!tableDescription.viewCount) {
            await queryInterface.addColumn('properties', 'viewCount', {
                type: Sequelize.INTEGER,
                defaultValue: 0
            });
        }
        
        // Add isFeatured if it doesn't exist
        if (!tableDescription.isFeatured) {
            await queryInterface.addColumn('properties', 'isFeatured', {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Remove columns in reverse order
        await queryInterface.removeColumn('properties', 'isFeatured');
        await queryInterface.removeColumn('properties', 'viewCount');
        await queryInterface.removeColumn('properties', 'ownershipType');
        await queryInterface.removeColumn('properties', 'ageOfProperty');
        await queryInterface.removeColumn('properties', 'availableFrom');
        await queryInterface.removeColumn('properties', 'possessionStatus');
        await queryInterface.removeColumn('properties', 'furnishingStatus');
        await queryInterface.removeColumn('properties', 'maintenanceCharge');
    }
};