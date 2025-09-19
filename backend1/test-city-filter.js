const db = require('./models');

async function testCityFilter() {
    try {
        console.log('Testing city filter functionality...');
        
        // Test 1: Get all properties first
        const allProperties = await db.Property.findAll({
            attributes: ['id', 'title', 'city', 'locality'],
            where: {
                status: { [db.Sequelize.Op.in]: ['active', 'pending'] }
            }
        });
        
        console.log('\n=== ALL PROPERTIES ===');
        allProperties.forEach((prop, index) => {
            console.log(`${index + 1}. ${prop.title} - ${prop.city}, ${prop.locality}`);
        });
        
        // Test 2: Filter by 'indore'
        const indoreProperties = await db.Property.findAll({
            attributes: ['id', 'title', 'city', 'locality'],
            where: {
                status: { [db.Sequelize.Op.in]: ['active', 'pending'] },
                city: { [db.Sequelize.Op.iLike]: '%indore%' }
            }
        });
        
        console.log('\n=== INDORE PROPERTIES ===');
        if (indoreProperties.length > 0) {
            indoreProperties.forEach((prop, index) => {
                console.log(`${index + 1}. ${prop.title} - ${prop.city}, ${prop.locality}`);
            });
        } else {
            console.log('No properties found in Indore');
        }
        
        // Test 3: Filter by 'mumbai' (should be empty)
        const mumbaiProperties = await db.Property.findAll({
            attributes: ['id', 'title', 'city', 'locality'],
            where: {
                status: { [db.Sequelize.Op.in]: ['active', 'pending'] },
                city: { [db.Sequelize.Op.iLike]: '%mumbai%' }
            }
        });
        
        console.log('\n=== MUMBAI PROPERTIES ===');
        if (mumbaiProperties.length > 0) {
            mumbaiProperties.forEach((prop, index) => {
                console.log(`${index + 1}. ${prop.title} - ${prop.city}, ${prop.locality}`);
            });
        } else {
            console.log('No properties found in Mumbai');
        }
        
        // Test 4: Check unique cities
        const uniqueCities = await db.Property.findAll({
            attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('city')), 'city']],
            where: {
                status: { [db.Sequelize.Op.in]: ['active', 'pending'] }
            }
        });
        
        console.log('\n=== AVAILABLE CITIES ===');
        uniqueCities.forEach(city => {
            console.log(`- ${city.city}`);
        });
        
    } catch (error) {
        console.error('Error testing city filter:', error);
    } finally {
        process.exit();
    }
}

testCityFilter();
