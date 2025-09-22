'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('properties', 'property_for', {
            type: Sequelize.ENUM('commercial', 'residential'),
            allowNull: false,
            defaultValue: 'residential',
            after: 'propertyType'
        });

        // Add index for better performance
        await queryInterface.addIndex('properties', ['property_for']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('properties', ['property_for']);
        await queryInterface.removeColumn('properties', 'property_for');
    }
};
