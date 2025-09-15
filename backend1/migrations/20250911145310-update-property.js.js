// Create a new migration file: migrations/007-update-property-defaults.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Update bathrooms default value
        await queryInterface.changeColumn('properties', 'bathrooms', {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: true
        });
        
        // Make optional fields nullable
        await queryInterface.changeColumn('properties', 'builtUpArea', {
            type: Sequelize.INTEGER,
            allowNull: true
        });
        
        await queryInterface.changeColumn('properties', 'floorNumber', {
            type: Sequelize.STRING,
            allowNull: true
        });
        
        await queryInterface.changeColumn('properties', 'totalFloors', {
            type: Sequelize.INTEGER,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert changes if needed
        await queryInterface.changeColumn('properties', 'bathrooms', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });
        
        await queryInterface.changeColumn('properties', 'builtUpArea', {
            type: Sequelize.INTEGER,
            allowNull: false
        });
        
        await queryInterface.changeColumn('properties', 'floorNumber', {
            type: Sequelize.STRING,
            allowNull: false
        });
        
        await queryInterface.changeColumn('properties', 'totalFloors', {
            type: Sequelize.INTEGER,
            allowNull: false
        }); 
    }
};