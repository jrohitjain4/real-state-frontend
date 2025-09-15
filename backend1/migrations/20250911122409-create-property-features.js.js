'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('property_features', {
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
                onDelete: 'CASCADE',
                unique: true
            },
            
            // Parking
            parking: {
                type: Sequelize.ENUM('none', 'bike', 'car', 'both'),
                defaultValue: 'none'
            },
            parkingCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            
            // Power & Water
            powerBackup: {
                type: Sequelize.ENUM('none', 'partial', 'full'),
                defaultValue: 'none'
            },
            waterSupply: {
                type: Sequelize.ENUM('corporation', 'borewell', 'both'),
                defaultValue: 'corporation'
            },
            
            // Basic Amenities
            lift: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            security: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            cctv: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            
            // Lifestyle Amenities
            gym: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            swimmingPool: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            clubHouse: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            playArea: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            
            // Other Features
            gasConnection: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            vastu: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            petFriendly: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            intercom: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            visitorParking: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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

        await queryInterface.addIndex('property_features', ['propertyId']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('property_features');
    }
};