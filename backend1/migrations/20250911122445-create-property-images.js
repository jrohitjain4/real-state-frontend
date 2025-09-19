'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('property_images', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            propertyId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'properties',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false
            },
            imageType: {
                type: Sequelize.ENUM(
                    'exterior',
                    'living-room',
                    'bedroom',
                    'bathroom',
                    'kitchen',
                    'balcony',
                    'floor-plan',
                    'location-map',
                    'other'
                ),
                defaultValue: 'other'
            },
            isPrimary: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            caption: {
                type: Sequelize.STRING,
                allowNull: true
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex('property_images', ['propertyId']);
        await queryInterface.addIndex('property_images', ['isPrimary']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('property_images');
    }
};