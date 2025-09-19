const db = require('./models');
const { Category, SubCategory } = db;

async function updateCategoriesAndSubcategoriesSafe() {
    try {
        console.log('Starting safe categories and subcategories update...');
        
        // Step 1: Update existing categories
        console.log('Updating existing categories...');
        
        // Update category 1: Buy -> Sell
        await Category.update({
            name: 'Sell',
            slug: 'sell',
            description: 'Properties for sale',
            icon: 'home-sale',
            displayOrder: 1
        }, { where: { id: 1 } });
        
        // Update category 2: Keep Rent as is
        await Category.update({
            name: 'Rent',
            slug: 'rent',
            description: 'Properties for rent',
            icon: 'home-rent',
            displayOrder: 2
        }, { where: { id: 2 } });
        
        // Update category 3: Keep PG/Co-living
        await Category.update({
            name: 'PG/Co-living',
            slug: 'pg-coliving',
            description: 'Paying guest and co-living spaces',
            icon: 'pg',
            displayOrder: 3
        }, { where: { id: 3 } });
        
        // Update category 4: Commercial -> Commercial Sell
        await Category.update({
            name: 'Commercial Sell',
            slug: 'commercial-sell',
            description: 'Commercial properties for sale',
            icon: 'commercial',
            displayOrder: 4
        }, { where: { id: 4 } });
        
        // Add new category: Commercial Rent
        const [commercialRentCat, created] = await Category.findOrCreate({
            where: { slug: 'commercial-rent' },
            defaults: {
                name: 'Commercial Rent',
                slug: 'commercial-rent',
                description: 'Commercial properties for rent',
                icon: 'commercial',
                displayOrder: 5,
                isActive: true
            }
        });
        
        console.log('Categories updated successfully!');
        
        // Step 2: Update existing subcategories to match our new structure
        console.log('Updating existing subcategories...');
        
        // Update subcategory 1: Apartment -> Apartment/Flat (for Sell)
        await SubCategory.update({
            name: 'Apartment/Flat',
            slug: 'apartment-flat',
            description: 'Apartments and flats for sale',
            propertyType: 'residential'
        }, { where: { id: 1 } });
        
        // Update subcategory 2: Villa -> Independent House/Villa (for Sell)
        await SubCategory.update({
            name: 'Independent House/Villa',
            slug: 'independent-house-villa',
            description: 'Independent houses and villas for sale',
            propertyType: 'residential'
        }, { where: { id: 2 } });
        
        // Update subcategory 3: Plot -> Plot/Land (for Sell)
        await SubCategory.update({
            name: 'Plot/Land',
            slug: 'plot-land',
            description: 'Residential plots and land for sale',
            propertyType: 'land'
        }, { where: { id: 3 } });
        
        // Step 3: Add new subcategories for all categories
        console.log('Adding new subcategories...');
        
        const newSubcategories = [
            // Additional subcategories for Sell (category 1)
            {
                categoryId: 1,
                name: 'Builder Floor',
                slug: 'builder-floor',
                description: 'Independent builder floors for sale',
                displayOrder: 4,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: 1,
                name: 'Farm House',
                slug: 'farm-house',
                description: 'Farm houses for sale',
                displayOrder: 5,
                isActive: true,
                propertyType: 'farmhouse'
            },
            {
                categoryId: 1,
                name: 'Studio Apartment',
                slug: 'studio-apartment',
                description: 'Studio apartments for sale',
                displayOrder: 6,
                isActive: true,
                propertyType: 'studio'
            },
            
            // Subcategories for Rent (category 2)
            {
                categoryId: 2,
                name: 'Apartment/Flat',
                slug: 'apartment-flat-rent',
                description: 'Apartments and flats for rent',
                displayOrder: 1,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: 2,
                name: 'Independent House/Villa',
                slug: 'independent-house-villa-rent',
                description: 'Independent houses and villas for rent',
                displayOrder: 2,
                isActive: true,
                propertyType: 'residential'
            },
            {
                categoryId: 2,
                name: 'Builder Floor',
                slug: 'builder-floor-rent',
                description: 'Independent builder floors for rent',
                displayOrder: 3,
                isActive: true,
                propertyType: 'residential'
            },
            
            // Subcategories for PG/Co-living (category 3)
            {
                categoryId: 3,
                name: 'PG for Men',
                slug: 'pg-men',
                description: 'Paying guest accommodation for men',
                displayOrder: 1,
                isActive: true,
                propertyType: 'pg'
            },
            {
                categoryId: 3,
                name: 'PG for Women',
                slug: 'pg-women',
                description: 'Paying guest accommodation for women',
                displayOrder: 2,
                isActive: true,
                propertyType: 'pg'
            },
            {
                categoryId: 3,
                name: 'Co-living Space',
                slug: 'co-living',
                description: 'Co-living spaces',
                displayOrder: 3,
                isActive: true,
                propertyType: 'pg'
            },
            
            // Subcategories for Commercial Sell (category 4)
            {
                categoryId: 4,
                name: 'Office Space',
                slug: 'office-space-sell',
                description: 'Office spaces for sale',
                displayOrder: 1,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: 4,
                name: 'Shop/Showroom',
                slug: 'shop-showroom-sell',
                description: 'Shops and showrooms for sale',
                displayOrder: 2,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: 4,
                name: 'Commercial Land',
                slug: 'commercial-land',
                description: 'Commercial land for sale',
                displayOrder: 3,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial-land'
            },
            {
                categoryId: 4,
                name: 'Warehouse/Godown',
                slug: 'warehouse-godown-sell',
                description: 'Warehouses for sale',
                displayOrder: 4,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            
            // Subcategories for Commercial Rent (category 5)
            {
                categoryId: commercialRentCat.id,
                name: 'Office Space',
                slug: 'office-space-rent',
                description: 'Office spaces for rent',
                displayOrder: 1,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            },
            {
                categoryId: commercialRentCat.id,
                name: 'Shop/Showroom',
                slug: 'shop-showroom-rent',
                description: 'Shops and showrooms for rent',
                displayOrder: 2,
                allowCommercial: true,
                isActive: true,
                propertyType: 'commercial'
            }
        ];

        // Insert new subcategories (ignore duplicates)
        for (const subcat of newSubcategories) {
            try {
                await SubCategory.findOrCreate({
                    where: { slug: subcat.slug },
                    defaults: subcat
                });
            } catch (error) {
                console.log(`Skipping duplicate subcategory: ${subcat.slug}`);
            }
        }

        console.log('Categories and subcategories updated successfully!');
        
        // Show final result
        const allCategories = await Category.findAll({
            include: [{ model: SubCategory, as: 'subcategories' }],
            order: [['displayOrder', 'ASC']]
        });
        
        console.log('\nFinal categories and subcategories:');
        allCategories.forEach(cat => {
            console.log(`\n${cat.name} (${cat.slug}):`);
            cat.subcategories.forEach(sub => {
                console.log(`  - ${sub.name} (${sub.slug})`);
            });
        });
        
    } catch (error) {
        console.error('Error updating categories and subcategories:', error);
    } finally {
        process.exit();
    }
}

updateCategoriesAndSubcategoriesSafe();
