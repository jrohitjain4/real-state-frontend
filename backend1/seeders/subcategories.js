// seeders/002-subcategories.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Get category IDs
        const categories = await queryInterface.sequelize.query(
            `SELECT id, slug FROM categories;`,
            { type: Sequelize.QueryTypes.SELECT }
        );
        
        const catMap = {};
        categories.forEach(cat => {
            catMap[cat.slug] = cat.id;
        });

        await queryInterface.bulkInsert('subcategories', [
            // For Buy & Rent
            {
                categoryId: catMap['buy'],
                name: 'Apartment',
                slug: 'apartment',
                description: 'Flats and apartments',
                displayOrder: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['buy'],
                name: 'Independent House/Villa',
                slug: 'independent-house-villa',
                description: 'Independent houses and villas',
                displayOrder: 2,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['buy'],
                name: 'Builder Floor',
                slug: 'builder-floor',
                description: 'Independent builder floors',
                displayOrder: 3,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['buy'],
                name: 'Plot/Land',
                slug: 'plot-land',
                description: 'Residential plots and land',
                displayOrder: 4,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Similar entries for Rent category
            {
                categoryId: catMap['rent'],
                name: 'Apartment',
                slug: 'apartment',
                description: 'Flats and apartments for rent',
                displayOrder: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Commercial subcategories
            {
                categoryId: catMap['commercial'],
                name: 'Office Space',
                slug: 'office-space',
                description: 'Office spaces for rent or sale',
                displayOrder: 1,
                allowCommercial: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['commercial'],
                name: 'Shop/Showroom',
                slug: 'shop-showroom',
                description: 'Shops and showrooms',
                displayOrder: 2,
                allowCommercial: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['commercial'],
                name: 'Warehouse/Godown',
                slug: 'warehouse-godown',
                description: 'Storage spaces',
                displayOrder: 3,
                allowCommercial: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // PG subcategories
            {
                categoryId: catMap['pg-coliving'],
                name: 'PG for Boys',
                slug: 'pg-boys',
                description: 'Paying guest for boys',
                displayOrder: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: catMap['pg-coliving'],
                name: 'PG for Girls',
                slug: 'pg-girls',
                description: 'Paying guest for girls',
                displayOrder: 2,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('subcategories', null, {});
    }
};