const express = require('express');
const request = require('supertest');
const app = express();

app.use(express.json());
app.use('/api', require('./routes/propertyRoutes'));

// Test property creation with proper data
async function testPropertyCreation() {
    try {
        console.log('Testing property creation with proper authentication...');
        
        // First, let's test without auth to see the error
        const testData = {
            categoryId: 1,
            subCategoryId: 3,
            propertyType: 'land',
            title: 'Test Plot',
            description: 'This is a test plot for sale with all required details for testing purposes.',
            address: 'Test Address',
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
            features: {
                boundaryWall: true,
                waterConnection: true,
                electricityConnection: false
            }
        };

        const response = await fetch('http://localhost:5000/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'invalid-token'
            },
            body: JSON.stringify(testData)
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        console.log('Response body:', responseText);

        if (response.headers.get('content-type')?.includes('application/json')) {
            const data = JSON.parse(responseText);
            console.log('JSON response:', data);
        } else {
            console.log('Non-JSON response received - server might be crashing');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
}

testPropertyCreation();
