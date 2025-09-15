// migrations/003-create-properties.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('properties', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            
            // Reference to dynamic categories
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            subCategoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'subcategories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            propertyConfiguration: {
                type: Sequelize.STRING,
                allowNull: true
            },
            
            // Basic Information
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            
            // Location Details
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            locality: {
                type: Sequelize.STRING,
                allowNull: false
            },
            landmark: {
                type: Sequelize.STRING,
                allowNull: true
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false
            },
            pincode: {
                type: Sequelize.STRING(6),
                allowNull: false
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: true
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: true
            },
            
            // Property Details
            bedrooms: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            bathrooms: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            balconies: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            floorNumber: {
                type: Sequelize.STRING,
                allowNull: true
            },
            totalFloors: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            
            // Area Details
            superArea: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            builtUpArea: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            carpetArea: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            
            // Pricing
            price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },
            priceUnit: {
                type: Sequelize.ENUM('total', 'per-sqft', 'per-sqyard', 'per-month'),
                defaultValue: 'total'
            },
            negotiable: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            
            // User reference
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            
            // Status
            status: {
                type: Sequelize.ENUM('draft', 'pending', 'active', 'inactive', 'sold', 'rented'),
                defaultValue: 'draft'
            },
            
            // SEO
            metaTitle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            metaDescription: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            
            // Timestamps
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Add indexes for better performance
        await queryInterface.addIndex('properties', ['slug']);
        await queryInterface.addIndex('properties', ['categoryId']);
        await queryInterface.addIndex('properties', ['subCategoryId']);
        await queryInterface.addIndex('properties', ['userId']);
        await queryInterface.addIndex('properties', ['status']);
        await queryInterface.addIndex('properties', ['city']);
        await queryInterface.addIndex('properties', ['locality']);
        await queryInterface.addIndex('properties', ['price']);
        await queryInterface.addIndex('properties', ['createdAt']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('properties');
    }
};