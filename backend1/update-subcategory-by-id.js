const db = require('./models');
const { SubCategory } = db;

async function updateSubcategoryPropertyTypesByID() {
    try {
        console.log('Updating subcategory property types by ID...');
        
        // Update specific subcategories with their property types based on ID
        const updates = [
            // From the output above
            { id: 1, name: 'Apartment/Flat', propertyType: 'residential' },
            { id: 2, name: 'Independent House/Villa', propertyType: 'residential' },
            { id: 3, name: 'Plot/Land', propertyType: 'land' },
            { id: 4, name: 'Apartment', propertyType: 'residential' },
            { id: 5, name: 'Villa', propertyType: 'residential' },
            { id: 6, name: 'Room', propertyType: 'residential' },
            { id: 7, name: 'PG', propertyType: 'pg' },
            { id: 8, name: 'Co-living', propertyType: 'pg' },
            { id: 9, name: 'Office', propertyType: 'commercial' },
            { id: 10, name: 'Shop', propertyType: 'commercial' },
            { id: 11, name: 'Warehouse', propertyType: 'commercial' },
            { id: 12, name: 'Builder Floor', propertyType: 'residential' },
            { id: 13, name: 'Farm House', propertyType: 'farmhouse' },
            { id: 14, name: 'Studio Apartment', propertyType: 'studio' },
            { id: 15, name: 'Apartment/Flat', propertyType: 'residential' },
            { id: 16, name: 'Independent House/Villa', propertyType: 'residential' },
            { id: 17, name: 'Builder Floor', propertyType: 'residential' },
            { id: 18, name: 'PG for Men', propertyType: 'pg' },
            { id: 19, name: 'PG for Women', propertyType: 'pg' },
            { id: 20, name: 'Office Space', propertyType: 'commercial' },
            { id: 21, name: 'Shop/Showroom', propertyType: 'commercial' },
            { id: 22, name: 'Commercial Land', propertyType: 'commercial-land' },
            { id: 23, name: 'Warehouse/Godown', propertyType: 'commercial' },
            { id: 24, name: 'Office Space', propertyType: 'commercial' },
            { id: 25, name: 'Shop/Showroom', propertyType: 'commercial' }
        ];
        
        for (const update of updates) {
            try {
                const result = await db.sequelize.query(
                    `UPDATE subcategories SET "propertyType" = :propertyType WHERE id = :id`,
                    {
                        replacements: { 
                            propertyType: update.propertyType, 
                            id: update.id 
                        }
                    }
                );
                console.log(`Updated ID ${update.id} (${update.name}) to ${update.propertyType}`);
            } catch (error) {
                console.log(`Error updating ID ${update.id}: ${error.message}`);
            }
        }
        
        console.log('Subcategory property types updated successfully!');
        
        // Show current subcategories with property types
        const allSubcats = await db.sequelize.query(
            'SELECT id, name, slug, "propertyType" FROM subcategories ORDER BY id',
            { type: db.Sequelize.QueryTypes.SELECT }
        );
        
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

updateSubcategoryPropertyTypesByID();
