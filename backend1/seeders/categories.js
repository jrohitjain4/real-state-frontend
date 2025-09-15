// seeders/001-categories.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Buy',
                slug: 'buy',
                description: 'Properties for sale',
                icon: 'home-sale',
                displayOrder: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Rent',
                slug: 'rent',
                description: 'Properties for rent',
                icon: 'home-rent',
                displayOrder: 2,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'PG/Co-living',
                slug: 'pg-coliving',
                description: 'Paying guest and co-living spaces',
                icon: 'pg',
                displayOrder: 3,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Commercial',
                slug: 'commercial',
                description: 'Commercial properties',
                icon: 'commercial',
                displayOrder: 4,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('categories', null, {});
    }
};