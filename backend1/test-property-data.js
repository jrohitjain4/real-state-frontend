const db = require('./models');

async function testPropertyData() {
    try {
        console.log('Testing property data with subcategories...');
        
        const properties = await db.Property.findAll({
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: db.SubCategory,
                    as: 'subcategory',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit: 3
        });
        
        console.log(`\n=== PROPERTY DATA ANALYSIS ===`);
        
        properties.forEach((property, index) => {
            console.log(`\n${index + 1}. Property Details:`);
            console.log(`   Title: "${property.title}"`);
            console.log(`   Category: ${property.category?.name || 'NOT FOUND'}`);
            console.log(`   Subcategory: ${property.subcategory?.name || 'NOT FOUND'}`);
            console.log(`   Property Configuration: ${property.propertyConfiguration || 'NOT SET'}`);
            console.log(`   Property Type: ${property.propertyType || 'NOT SET'}`);
            console.log(`   Bedrooms: ${property.bedrooms}`);
            console.log(`   Super Area: ${property.superArea}`);
            console.log(`   Plot Area: ${property.plotArea}`);
        });
        
    } catch (error) {
        console.error('Error testing property data:', error);
    } finally {
        process.exit();
    }
}

testPropertyData();
