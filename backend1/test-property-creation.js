const db = require('./models');
const propertyController = require('./controllers/propertyController');

// Mock request and response objects for testing
const mockReq = {
    user: { id: 1 }, // Assuming user ID 1 exists
    body: {
        categoryId: 1,
        subCategoryId: 3, // Plot/Land
        propertyType: 'land',
        title: 'Test Plot for Sale',
        description: 'This is a test plot for sale with all required details for testing purposes. It has more than 50 characters.',
        address: 'Test Address, Test Street',
        locality: 'Test Locality',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        plotArea: 1000,
        plotLength: 40,
        plotBreadth: 25,
        plotFacing: 'North',
        roadWidth: 20,
        openSides: '2',
        price: 500000,
        negotiable: true,
        features: {
            boundaryWall: true,
            waterConnection: true,
            electricityConnection: false
        }
    }
};

const mockRes = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log(`Response Status: ${this.statusCode || 200}`);
        console.log('Response Data:', JSON.stringify(data, null, 2));
        return this;
    }
};

async function testPropertyCreation() {
    try {
        console.log('Testing property creation...');
        console.log('Request data:', JSON.stringify(mockReq.body, null, 2));
        
        await propertyController.createProperty(mockReq, mockRes);
        
    } catch (error) {
        console.error('Test failed with error:', error);
    } finally {
        process.exit();
    }
}

testPropertyCreation();
