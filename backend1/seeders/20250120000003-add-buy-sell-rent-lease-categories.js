'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if categories already exist
        const existingBuy = await queryInterface.rawSelect('categories', {
            where: { slug: 'buy' }
        }, ['id']);

        const existingSell = await queryInterface.rawSelect('categories', {
            where: { slug: 'sell' }
        }, ['id']);

        const existingRent = await queryInterface.rawSelect('categories', {
            where: { slug: 'rent' }
        }, ['id']);

        const existingLease = await queryInterface.rawSelect('categories', {
            where: { slug: 'lease' }
        }, ['id']);

        let buyCategoryId, sellCategoryId, rentCategoryId, leaseCategoryId;

        // Create Buy category if it doesn't exist
        if (!existingBuy) {
            await queryInterface.bulkInsert('categories', [{
                name: 'Buy',
                slug: 'buy',
                description: 'Properties for purchase',
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
            buyCategoryId = await queryInterface.rawSelect('categories', {
                where: { slug: 'buy' }
            }, ['id']);
        } else {
            buyCategoryId = existingBuy;
        }

        // Create Sell category if it doesn't exist
        if (!existingSell) {
            await queryInterface.bulkInsert('categories', [{
                name: 'Sell',
                slug: 'sell',
                description: 'Properties for sale',
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
            sellCategoryId = await queryInterface.rawSelect('categories', {
                where: { slug: 'sell' }
            }, ['id']);
        } else {
            sellCategoryId = existingSell;
        }

        // Create Rent category if it doesn't exist
        if (!existingRent) {
            await queryInterface.bulkInsert('categories', [{
                name: 'Rent',
                slug: 'rent',
                description: 'Properties for rent',
                isActive: true,
                displayOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
            rentCategoryId = await queryInterface.rawSelect('categories', {
                where: { slug: 'rent' }
            }, ['id']);
        } else {
            rentCategoryId = existingRent;
        }

        // Create Lease category if it doesn't exist
        if (!existingLease) {
            await queryInterface.bulkInsert('categories', [{
                name: 'Lease',
                slug: 'lease',
                description: 'Properties for lease',
                isActive: true,
                displayOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            }]);
            leaseCategoryId = await queryInterface.rawSelect('categories', {
                where: { slug: 'lease' }
            }, ['id']);
        } else {
            leaseCategoryId = existingLease;
        }

        // Create subcategories for all categories (Buy, Sell, Rent, Lease)
        const subcategories = [
            // Buy category subcategories
            {
                categoryId: buyCategoryId,
                name: 'Flats',
                slug: 'flats-buy',
                description: 'Apartment flats for purchase',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 1,
                maxBedrooms: 5,
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'House',
                slug: 'house-buy',
                description: 'Independent houses for purchase',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 10,
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Villa',
                slug: 'villa-buy',
                description: 'Luxury villas for purchase',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 3,
                maxBedrooms: 15,
                isActive: true,
                displayOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Farmhouse',
                slug: 'farmhouse-buy',
                description: 'Farmhouses for purchase',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 8,
                isActive: true,
                displayOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Plot/Land',
                slug: 'plot-land-buy',
                description: 'Plots and land for purchase',
                propertyType: 'land',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'PG/Coliving',
                slug: 'pg-coliving-buy',
                description: 'PG accommodations for purchase',
                propertyType: 'pg',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Godown',
                slug: 'godown-buy',
                description: 'Storage spaces for purchase',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Offices',
                slug: 'offices-buy',
                description: 'Office spaces for purchase',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: buyCategoryId,
                name: 'Shops',
                slug: 'shops-buy',
                description: 'Retail shops for purchase',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Sell category subcategories
            {
                categoryId: sellCategoryId,
                name: 'Flats',
                slug: 'flats-sell',
                description: 'Apartment flats for sale',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 1,
                maxBedrooms: 5,
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'House',
                slug: 'house-sell',
                description: 'Independent houses for sale',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 10,
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Villa',
                slug: 'villa-sell',
                description: 'Luxury villas for sale',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 3,
                maxBedrooms: 15,
                isActive: true,
                displayOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Farmhouse',
                slug: 'farmhouse-sell',
                description: 'Farmhouses for sale',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 8,
                isActive: true,
                displayOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Plot/Land',
                slug: 'plot-land-sell',
                description: 'Plots and land for sale',
                propertyType: 'land',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'PG/Coliving',
                slug: 'pg-coliving-sell',
                description: 'PG accommodations for sale',
                propertyType: 'pg',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Godown',
                slug: 'godown-sell',
                description: 'Storage spaces for sale',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Offices',
                slug: 'offices-sell',
                description: 'Office spaces for sale',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: sellCategoryId,
                name: 'Shops',
                slug: 'shops-sell',
                description: 'Retail shops for sale',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Rent category subcategories
            {
                categoryId: rentCategoryId,
                name: 'Flats',
                slug: 'flats-rent',
                description: 'Apartment flats for rent',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 1,
                maxBedrooms: 5,
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'House',
                slug: 'house-rent',
                description: 'Independent houses for rent',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 10,
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Villa',
                slug: 'villa-rent',
                description: 'Luxury villas for rent',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 3,
                maxBedrooms: 15,
                isActive: true,
                displayOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Farmhouse',
                slug: 'farmhouse-rent',
                description: 'Farmhouses for rent',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 8,
                isActive: true,
                displayOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Plot/Land',
                slug: 'plot-land-rent',
                description: 'Plots and land for rent',
                propertyType: 'land',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'PG/Coliving',
                slug: 'pg-coliving-rent',
                description: 'PG accommodations for rent',
                propertyType: 'pg',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Godown',
                slug: 'godown-rent',
                description: 'Storage spaces for rent',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Offices',
                slug: 'offices-rent',
                description: 'Office spaces for rent',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: rentCategoryId,
                name: 'Shops',
                slug: 'shops-rent',
                description: 'Retail shops for rent',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Lease category subcategories
            {
                categoryId: leaseCategoryId,
                name: 'Flats',
                slug: 'flats-lease',
                description: 'Apartment flats for lease',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 1,
                maxBedrooms: 5,
                isActive: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'House',
                slug: 'house-lease',
                description: 'Independent houses for lease',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 10,
                isActive: true,
                displayOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Villa',
                slug: 'villa-lease',
                description: 'Luxury villas for lease',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 3,
                maxBedrooms: 15,
                isActive: true,
                displayOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Farmhouse',
                slug: 'farmhouse-lease',
                description: 'Farmhouses for lease',
                propertyType: 'residential',
                allowCommercial: false,
                minBedrooms: 2,
                maxBedrooms: 8,
                isActive: true,
                displayOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Plot/Land',
                slug: 'plot-land-lease',
                description: 'Plots and land for lease',
                propertyType: 'land',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'PG/Coliving',
                slug: 'pg-coliving-lease',
                description: 'PG accommodations for lease',
                propertyType: 'pg',
                allowCommercial: false,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 6,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Godown',
                slug: 'godown-lease',
                description: 'Storage spaces for lease',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Offices',
                slug: 'offices-lease',
                description: 'Office spaces for lease',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                categoryId: leaseCategoryId,
                name: 'Shops',
                slug: 'shops-lease',
                description: 'Retail shops for lease',
                propertyType: 'commercial',
                allowCommercial: true,
                minBedrooms: 0,
                maxBedrooms: 0,
                isActive: true,
                displayOrder: 9,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Insert subcategories one by one to avoid conflicts
        for (const subcategory of subcategories) {
            try {
                await queryInterface.bulkInsert('subcategories', [subcategory]);
            } catch (error) {
                // Skip if subcategory already exists
                if (error.name !== 'SequelizeUniqueConstraintError') {
                    console.error('Error inserting subcategory:', subcategory.name, error.message);
                }
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Remove only the new subcategories we created
        await queryInterface.bulkDelete('subcategories', {
            slug: [
                'flats-buy', 'house-buy', 'villa-buy', 'farmhouse-buy', 'plot-land-buy', 'pg-coliving-buy', 'godown-buy', 'offices-buy', 'shops-buy',
                'flats-sell', 'house-sell', 'villa-sell', 'farmhouse-sell', 'plot-land-sell', 'pg-coliving-sell', 'godown-sell', 'offices-sell', 'shops-sell',
                'flats-rent', 'house-rent', 'villa-rent', 'farmhouse-rent', 'plot-land-rent', 'pg-coliving-rent', 'godown-rent', 'offices-rent', 'shops-rent',
                'flats-lease', 'house-lease', 'villa-lease', 'farmhouse-lease', 'plot-land-lease', 'pg-coliving-lease', 'godown-lease', 'offices-lease', 'shops-lease'
            ]
        });
    }
};
