const db = require('./models');

async function testMinimal() {
    try {
        console.log('Testing database connection...');
        
        // Test if we can query categories
        const categories = await db.Category.findAll();
        console.log('Categories found:', categories.length);
        
        // Test if we can query users
        const users = await db.User.findAll();
        console.log('Users found:', users.length);
        
        // Test if we can create a simple property with minimal data
        console.log('Testing property creation...');
        
        const testProperty = await db.Property.create({
            userId: 1,
            categoryId: 1,
            subCategoryId: 3,
            title: 'Test Property',
            slug: 'test-property-' + Date.now(),
            description: 'Test description for property creation',
            address: 'Test Address',
            locality: 'Test Locality',
            city: 'Test City',
            state: 'Test State',
            pincode: '123456',
            price: 100000,
            status: 'pending',
            propertyType: 'land',
            plotArea: 1000
        });
        
        console.log('Property created successfully:', testProperty.id);
        
    } catch (error) {
        console.error('Test failed:', error.message);
        console.error('Error details:', error);
    } finally {
        process.exit();
    }
}

testMinimal();
