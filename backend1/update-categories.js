const db = require('./models');
const { Category, SubCategory } = db;

async function updateCategoriesAndSubcategories() {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await SubCategory.destroy({ where: {} });
        await Category.destroy({ where: {} });
        
        // Insert new categories
        console.log('Inserting new categories...');
        const categories = await Category.bulkCreate([
            {
                name: 'Sell',
                slug: 'sell',
                description: 'Properties for sale',
                icon: 'home-sale',
                displayOrder: 1,
                isActive: true
            },
            {
                name: 'Rent',
                slug: 'rent',
                description: 'Properties for rent',
                icon: 'home-rent',
                displayOrder: 2,
                isActive: true
            },
            {
                name: 'PG/Co-living',
                slug: 'pg-coliving',
                description: 'Paying guest and co-living spaces',
                icon: 'pg',
                displayOrder: 3,
                isActive: true
            },
            {
                name: 'Commercial Sell',
                slug: 'commercial-sell',
                description: 'Commercial properties for sale',
                icon: 'commercial',
                displayOrder: 4,
                isActive: true
            },
            {
                name: 'Commercial Rent',
                slug: 'commercial-rent',
                description: 'Commercial properties for rent',
                icon: 'commercial',
                displayOrder: 5,
                isActive: true
            }
        ]);

        // Get category IDs by slug
        const catMap = {};
        categories.forEach(cat => {
            catMap[cat.slug] = cat.id;
        });

        // Insert new subcategories
        console.log('Inserting new subcategories...');
        await SubCategory.bulkCreate([
            // For Sell
            {
                categoryId: catMap['sell'],
                name: 'Apartment/Flat',
                slug: 'apartment-flat',
                description: 'Apartments and flats for sale',
                displayOrder: 1,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: catMap['sell'],
                name: 'Independent House/Villa',
                slug: 'independent-house-villa',
                description: 'Independent houses and villas for sale',
                displayOrder: 2,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: catMap['sell'],
                name: 'Builder Floor',
                slug: 'builder-floor',
                description: 'Independent builder floors for sale',
                displayOrder: 3,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: catMap['sell'],
                name: 'Plot/Land',
                slug: 'plot-land',
                description: 'Residential plots and land for sale',
                displayOrder: 4,
                isActive: true,
                propertyType: 'land'
            },
            {
                categoryId: catMap['sell'],
                name: 'Farm House',
                slug: 'farm-house',
                description: 'Farm houses for sale',
                displayOrder: 5,
                isActive: true,
                propertyType: 'farmhouse'
            },
            {
                categoryId: catMap['sell'],
                name: 'Studio Apartment',
                slug: 'studio-apartment',
                description: 'Studio apartments for sale',
                displayOrder: 6,
                isActive: true,
                propertyType: 'studio'
            },
            
            // For Rent
            {
                categoryId: catMap['rent'],
                name: 'Apartment/Flat',
                slug: 'apartment-flat-rent',
                description: 'Apartments and flats for rent',
                displayOrder: 1,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: catMap['rent'],
                name: 'Independent House/Villa',
                slug: 'independent-house-villa-rent',
                description: 'Independent houses and villas for rent',
                displayOrder: 2,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: catMap['rent'],
                name: 'Builder Floor',
                slug: 'builder-floor-rent',
                description: 'Independent builder floors for rent',
                displayOrder: 3,
                isActive: true,
                propertyType: 'residential'
            },
            
            // Commercial Sell
            {
                categoryId: catMap['commercial-sell'],
                name: 'Office Space',
                slug: 'office-space-sell',
                description: 'Office spaces for sale',
                displayOrder: 1,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: catMap['commercial-sell'],
                name: 'Shop/Showroom',
                slug: 'shop-showroom-sell',
                description: 'Shops and showrooms for sale',
                displayOrder: 2,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: catMap['commercial-sell'],
                name: 'Commercial Land',
                slug: 'commercial-land',
                description: 'Commercial land for sale',
                displayOrder: 3,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial-land'
            },
            {
                categoryId: catMap['commercial-sell'],
                name: 'Warehouse/Godown',
                slug: 'warehouse-godown-sell',
                description: 'Warehouses for sale',
                displayOrder: 4,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            
            // Commercial Rent
            {
                categoryId: catMap['commercial-rent'],
                name: 'Office Space',
                slug: 'office-space-rent',
                description: 'Office spaces for rent',
                displayOrder: 1,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: catMap['commercial-rent'],
                name: 'Shop/Showroom',
                slug: 'shop-showroom-rent',
                description: 'Shops and showrooms for rent',
                displayOrder: 2,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            
            // PG subcategories
            {
                categoryId: catMap['pg-coliving'],
                name: 'PG for Men',
                slug: 'pg-men',
                description: 'Paying guest accommodation for men',
                displayOrder: 1,
                isActive: true,
                propertyType: 'pg'
            },
            {
                categoryId: catMap['pg-coliving'],
                name: 'PG for Women',
                slug: 'pg-women',
                description: 'Paying guest accommodation for women',
                displayOrder: 2,
                isActive: true,
                propertyType: 'pg'
            },
            {
                categoryId: catMap['pg-coliving'],
                name: 'Co-living Space',
                slug: 'co-living',
                description: 'Co-living spaces',
                displayOrder: 3,
                isActive: true,
                propertyType: 'pg'
            }
        ]);

        console.log('Categories and subcategories updated successfully!');
        console.log('New categories:', categories.map(c => c.name));
        
    } catch (error) {
        console.error('Error updating categories and subcategories:', error);
    } finally {
        process.exit();
    }
}

updateCategoriesAndSubcategories();
