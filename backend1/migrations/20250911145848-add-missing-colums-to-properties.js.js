// Create migrations/008-add-missing-columns.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check and add rentAmount if it doesn't exist
        const tableDescription = await queryInterface.describeTable('properties');
        
        if (!tableDescription.rentAmount) {
            await queryInterface.addColumn('properties', 'rentAmount', {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            });
        }
        
        if (!tableDescription.securityDeposit) {
            await queryInterface.addColumn('properties', 'securityDeposit', {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            });
        }
        
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
    },

    down: async (queryInterface, Sequelize) => {
        // Remove columns if needed
    }
};