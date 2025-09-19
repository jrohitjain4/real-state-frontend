const db = require('./models');
const { SubCategory } = db;

async function updateSubcategoryPropertyTypes() {
    try {
        console.log('Updating subcategory property types...');
        
        // Update specific subcategories with their property types
        const updates = [
            // Sell category subcategories
            { slug: 'apartment-flat', propertyType: 'residential' },
            { slug: 'independent-house-villa', propertyType: 'residential' },
            { slug: 'builder-floor', propertyType: 'residential' },
            { slug: 'plot-land', propertyType: 'land' },
            { slug: 'farm-house', propertyType: 'farmhouse' },
            { slug: 'studio-apartment', propertyType: 'studio' },
            
            // Rent category subcategories
            { slug: 'apartment-flat-rent', propertyType: 'residential' },
            { slug: 'independent-house-villa-rent', propertyType: 'residential' },
            { slug: 'builder-floor-rent', propertyType: 'residential' },
            
            // Commercial Sell
            { slug: 'office-space-sell', propertyType: 'commercial' },
            { slug: 'shop-showroom-sell', propertyType: 'commercial' },
            { slug: 'commercial-land', propertyType: 'commercial-land' },
            { slug: 'warehouse-godown-sell', propertyType: 'commercial' },
            
            // Commercial Rent
            { slug: 'office-space-rent', propertyType: 'commercial' },
            { slug: 'shop-showroom-rent', propertyType: 'commercial' },
            
            // PG subcategories
            { slug: 'pg-men', propertyType: 'pg' },
            { slug: 'pg-women', propertyType: 'pg' },
            { slug: 'co-living', propertyType: 'pg' }
        ];
        
        for (const update of updates) {
            const result = await SubCategory.update(
                { propertyType: update.propertyType },
                { where: { slug: update.slug } }
            );
            console.log(`Updated ${update.slug} to ${update.propertyType}: ${result[0]} rows affected`);
        }
        
        console.log('Subcategory property types updated successfully!');
        
        // Show current subcategories with property types
        const allSubcats = await SubCategory.findAll({
            attributes: ['id', 'name', 'slug', 'propertyType'],
            order: [['id', 'ASC']]
        });
        
        console.log('\nCurrent subcategories:');
        allSubcats.forEach(sub => {
            console.log(`${sub.id}: ${sub.name} (${sub.slug}) -> ${sub.propertyType}`);
        });
        
    } catch (error) {
        console.error('Error updating subcategory property types:', error);
    } finally {
        process.exit();
    }
}

updateSubcategoryPropertyTypes();
