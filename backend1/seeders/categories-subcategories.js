// seeders/002-categories-subcategories.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Insert categories
        await queryInterface.bulkInsert('categories', [
            {
                id: 1,
                name: 'Buy',
                slug: 'buy',
                description: 'Properties for sale',
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: 'Rent',
                slug: 'rent',
                description: 'Properties for rent',
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Insert subcategories
        await queryInterface.bulkInsert('subcategories', [
            // For Buy
            {
                categoryId: 1,
                name: 'Apartment',
                slug: 'apartment',
                description: 'Apartments for sale',
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: 1,
                name: 'Villa',
                slug: 'villa',
                description: 'Villas for sale',
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // For Rent
            {
                categoryId: 2,
                name: 'Apartment',
                slug: 'apartment-rent',
                description: 'Apartments for rent',
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: 2,
                name: 'Villa',
                slug: 'villa-rent',
                description: 'Villas for rent',
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('subcategories', null, {});
        await queryInterface.bulkDelete('categories', null, {});
    }
};