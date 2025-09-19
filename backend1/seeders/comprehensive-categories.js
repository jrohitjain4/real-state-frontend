const db = require('../models');
const { Category, SubCategory } = db;

const comprehensiveCategories = [
    {
        name: 'Buy',
        slug: 'buy',
        description: 'Properties for sale',
        displayOrder: 1,
        subcategories: [
            { name: 'Apartment', slug: 'apartment-buy', description: 'Apartments for sale', propertyType: 'residential', displayOrder: 1 },
            { name: 'Villa', slug: 'villa-buy', description: 'Villas for sale', propertyType: 'residential', displayOrder: 2 },
            { name: 'Plot', slug: 'plot-buy', description: 'Residential plots for sale', propertyType: 'land', displayOrder: 3 },
            { name: 'House', slug: 'house-buy', description: 'Independent houses for sale', propertyType: 'residential', displayOrder: 4 },
            { name: 'Farmhouse', slug: 'farmhouse-buy', description: 'Farmhouses for sale', propertyType: 'farmhouse', displayOrder: 5 },
            { name: 'Commercial Office', slug: 'commercial-office-buy', description: 'Commercial offices for sale', propertyType: 'commercial', displayOrder: 6 },
            { name: 'Shop', slug: 'shop-buy', description: 'Shops for sale', propertyType: 'commercial', displayOrder: 7 },
            { name: 'Warehouse', slug: 'warehouse-buy', description: 'Warehouses for sale', propertyType: 'commercial', displayOrder: 8 },
            { name: 'Commercial Land', slug: 'commercial-land-buy', description: 'Commercial land for sale', propertyType: 'commercial-land', displayOrder: 9 },
            { name: 'Agriculture Land', slug: 'agriculture-land-buy', description: 'Agriculture land for sale', propertyType: 'agriculture-land', displayOrder: 10 }
        ]
    },
    {
        name: 'Rent',
        slug: 'rent',
        description: 'Properties for rent',
        displayOrder: 2,
        subcategories: [
            { name: 'Apartment', slug: 'apartment-rent', description: 'Apartments for rent', propertyType: 'residential', displayOrder: 1 },
            { name: 'Villa', slug: 'villa-rent', description: 'Villas for rent', propertyType: 'residential', displayOrder: 2 },
            { name: 'House', slug: 'house-rent', description: 'Independent houses for rent', propertyType: 'residential', displayOrder: 3 },
            { name: 'PG', slug: 'pg-rent', description: 'PG accommodations', propertyType: 'pg', displayOrder: 4 },
            { name: 'Commercial Office', slug: 'commercial-office-rent', description: 'Commercial offices for rent', propertyType: 'commercial', displayOrder: 5 },
            { name: 'Shop', slug: 'shop-rent', description: 'Shops for rent', propertyType: 'commercial', displayOrder: 6 },
            { name: 'Warehouse', slug: 'warehouse-rent', description: 'Warehouses for rent', propertyType: 'commercial', displayOrder: 7 },
            { name: 'Co-working Space', slug: 'coworking-rent', description: 'Co-working spaces for rent', propertyType: 'commercial', displayOrder: 8 }
        ]
    },
    {
        name: 'Sell',
        slug: 'sell',
        description: 'Properties for sale (alternative to Buy)',
        displayOrder: 3,
        subcategories: [
            { name: 'Residential Plot', slug: 'residential-plot-sell', description: 'Residential plots for sale', propertyType: 'land', displayOrder: 1 },
            { name: 'Commercial Plot', slug: 'commercial-plot-sell', description: 'Commercial plots for sale', propertyType: 'commercial-land', displayOrder: 2 },
            { name: 'Agriculture Land', slug: 'agriculture-land-sell', description: 'Agriculture land for sale', propertyType: 'agriculture-land', displayOrder: 3 },
            { name: 'Industrial Land', slug: 'industrial-land-sell', description: 'Industrial land for sale', propertyType: 'industrial-land', displayOrder: 4 },
            { name: 'Farmhouse', slug: 'farmhouse-sell', description: 'Farmhouses for sale', propertyType: 'farmhouse', displayOrder: 5 },
            { name: 'Builder Floor', slug: 'builder-floor-sell', description: 'Builder floors for sale', propertyType: 'residential', displayOrder: 6 },
            { name: 'Penthouse', slug: 'penthouse-sell', description: 'Penthouses for sale', propertyType: 'residential', displayOrder: 7 }
        ]
    },
    {
        name: 'Lease',
        slug: 'lease',
        description: 'Properties for lease',
        displayOrder: 4,
        subcategories: [
            { name: 'Commercial Office', slug: 'commercial-office-lease', description: 'Commercial offices for lease', propertyType: 'commercial', displayOrder: 1 },
            { name: 'Retail Space', slug: 'retail-space-lease', description: 'Retail spaces for lease', propertyType: 'commercial', displayOrder: 2 },
            { name: 'Warehouse', slug: 'warehouse-lease', description: 'Warehouses for lease', propertyType: 'commercial', displayOrder: 3 },
            { name: 'Industrial Land', slug: 'industrial-land-lease', description: 'Industrial land for lease', propertyType: 'industrial-land', displayOrder: 4 },
            { name: 'Agriculture Land', slug: 'agriculture-land-lease', description: 'Agriculture land for lease', propertyType: 'agriculture-land', displayOrder: 5 }
        ]
    }
];

async function seedComprehensiveCategories() {
    try {
        console.log('🌱 Starting comprehensive categories seeding...');
        
        // Clear existing data (in correct order due to foreign key constraints)
        await db.PropertyFeature.destroy({ where: {} });
        await db.PropertyImage.destroy({ where: {} });
        await db.Property.destroy({ where: {} });
        await SubCategory.destroy({ where: {} });
        await Category.destroy({ where: {} });
        console.log('✅ Cleared existing data');
        
        // Create categories with subcategories
        for (const categoryData of comprehensiveCategories) {
            const { subcategories, ...categoryInfo } = categoryData;
            
            const category = await Category.create(categoryInfo);
            console.log(`✅ Created category: ${category.name}`);
            
            // Create subcategories for this category
            for (const subcategoryData of subcategories) {
                await SubCategory.create({
                    ...subcategoryData,
                    categoryId: category.id
                });
                console.log(`  ✅ Created subcategory: ${subcategoryData.name} (${subcategoryData.propertyType})`);
            }
        }
        
        console.log('🎉 Comprehensive categories seeding completed successfully!');
        
        // Display summary
        const totalCategories = await Category.count();
        const totalSubcategories = await SubCategory.count();
        console.log(`📊 Summary: ${totalCategories} categories, ${totalSubcategories} subcategories created`);
        
    } catch (error) {
        console.error('❌ Error seeding comprehensive categories:', error);
        throw error;
    }
}

// Run the seeder
if (require.main === module) {
    seedComprehensiveCategories()
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedComprehensiveCategories, comprehensiveCategories };
