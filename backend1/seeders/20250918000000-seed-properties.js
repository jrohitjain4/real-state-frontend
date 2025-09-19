'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, create a demo user if not exists
    const demoUserEmail = 'demo@realstate.com';
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    const [demoUser] = await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      email: demoUserEmail,
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { 
      returning: true,
      ignoreDuplicates: true 
    });

    // Get the user ID
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = '${demoUserEmail}' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userId = users[0]?.id || demoUser?.id;

    // Get categories and subcategories
    const categories = await queryInterface.sequelize.query(
      'SELECT * FROM categories ORDER BY id;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const subcategories = await queryInterface.sequelize.query(
      'SELECT * FROM subcategories ORDER BY id;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categories.length === 0 || subcategories.length === 0) {
        console.log('Categories not found, will use default IDs');
        // Set default category IDs if not found
        const defaultCategories = [
            { id: 1, name: 'Residential' },
            { id: 2, name: 'Commercial' },
            { id: 3, name: 'Land' }
        ];
        const defaultSubcategories = [
            { id: 1, name: 'Apartment' },
            { id: 2, name: 'Villa' },
            { id: 3, name: 'House' },
            { id: 4, name: 'Office' },
            { id: 5, name: 'Shop' },
            { id: 6, name: 'Residential Plot' }
        ];
    }

    // Property listings data
    const properties = [
      // Residential Properties
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Residential')?.id || 1,
        subCategoryId: subcategories.find(s => s.name === 'Apartment')?.id || 1,
        propertyConfiguration: '2BHK',
        title: 'Luxury 2BHK Apartment in Prime Location',
        slug: 'luxury-2bhk-apartment-prime-location',
        description: 'Beautiful 2BHK apartment with modern amenities, located in the heart of the city. Features include spacious rooms, modular kitchen, and parking space.',
        price: 8500000,
        priceUnit: 'total',
        negotiable: true,
        address: '123 Green Valley Apartments, Sector 15',
        locality: 'Green Valley',
        landmark: 'Near Metro Station',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        latitude: 19.0760,
        longitude: 72.8777,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        floorNumber: 5,
        totalFloors: 12,
        superArea: 1200,
        builtUpArea: 1000,
        carpetArea: 850,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Residential')?.id || 1,
        subCategoryId: subcategories.find(s => s.name === 'Villa')?.id || 2,
        propertyConfiguration: '4BHK',
        title: 'Spacious 4BHK Villa with Garden',
        slug: 'spacious-4bhk-villa-with-garden',
        description: 'Independent villa with beautiful garden, swimming pool, and modern architecture. Perfect for families looking for luxury living.',
        price: 25000000,
        priceUnit: 'total',
        negotiable: true,
        address: '456 Royal Gardens, Bandra West',
        locality: 'Bandra West',
        landmark: 'Near Bandra Station',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        latitude: 19.0596,
        longitude: 72.8295,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        floorNumber: null,
        totalFloors: 2,
        superArea: 3500,
        builtUpArea: 3000,
        carpetArea: 2800,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Residential')?.id || 1,
        subCategoryId: subcategories.find(s => s.name === 'House')?.id || 3,
        propertyConfiguration: '3BHK',
        title: 'Modern 3BHK Independent House',
        slug: 'modern-3bhk-independent-house',
        description: 'Well-designed independent house with parking, terrace, and all modern amenities. Great connectivity to schools and hospitals.',
        price: 15000000,
        priceUnit: 'total',
        negotiable: true,
        address: '789 Sunrise Colony, Andheri East',
        locality: 'Andheri East',
        landmark: 'Near Airport',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400069',
        latitude: 19.1136,
        longitude: 72.8697,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        floorNumber: null,
        totalFloors: 2,
        superArea: 2200,
        builtUpArea: 1800,
        carpetArea: 1600,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Commercial Properties
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Commercial')?.id || 2,
        subCategoryId: subcategories.find(s => s.name === 'Office')?.id || 4,
        propertyConfiguration: null,
        title: 'Premium Office Space in Business District',
        slug: 'premium-office-space-business-district',
        description: 'Modern office space with sea view, conference rooms, and premium amenities. Perfect for IT companies and corporate offices.',
        price: 45000,
        priceUnit: 'sqft',
        negotiable: true,
        address: '101 Business Hub, Nariman Point',
        locality: 'Nariman Point',
        landmark: 'Near Stock Exchange',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400021',
        latitude: 18.9322,
        longitude: 72.8264,
        bedrooms: null,
        bathrooms: 4,
        balconies: null,
        floorNumber: 15,
        totalFloors: 25,
        superArea: 5000,
        builtUpArea: 4500,
        carpetArea: 4200,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Commercial')?.id || 2,
        subCategoryId: subcategories.find(s => s.name === 'Shop')?.id || 5,
        propertyConfiguration: null,
        title: 'Prime Retail Shop in Shopping Mall',
        slug: 'prime-retail-shop-shopping-mall',
        description: 'Ground floor retail space in busy shopping mall with high footfall. Perfect for retail business, restaurants, or showrooms.',
        price: 12000000,
        priceUnit: 'total',
        negotiable: true,
        address: '202 City Mall, Borivali West',
        locality: 'Borivali West',
        landmark: 'City Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400092',
        latitude: 19.2307,
        longitude: 72.8567,
        bedrooms: null,
        bathrooms: 2,
        balconies: null,
        floorNumber: 0,
        totalFloors: 3,
        superArea: 800,
        builtUpArea: 750,
        carpetArea: 700,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Land/Plot Properties
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Land')?.id || 3,
        subCategoryId: subcategories.find(s => s.name === 'Residential Plot')?.id || 6,
        propertyConfiguration: null,
        title: 'Premium Residential Plot in Gated Community',
        slug: 'premium-residential-plot-gated-community',
        description: 'Well-located residential plot in gated community with all amenities. Clear title, ready for construction with approved building plans.',
        price: 18000000,
        priceUnit: 'total',
        negotiable: true,
        address: '303 Green Acres, Thane West',
        locality: 'Thane West',
        landmark: 'Near Highway',
        city: 'Thane',
        state: 'Maharashtra',
        pincode: '400601',
        latitude: 19.2183,
        longitude: 72.9781,
        bedrooms: null,
        bathrooms: null,
        balconies: null,
        floorNumber: null,
        totalFloors: null,
        superArea: 2400,
        builtUpArea: null,
        carpetArea: null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Rental Properties
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Residential')?.id || 1,
        subCategoryId: subcategories.find(s => s.name === 'Apartment')?.id || 1,
        propertyConfiguration: '1BHK',
        title: 'Cozy 1BHK Apartment for Rent',
        slug: 'cozy-1bhk-apartment-for-rent',
        description: 'Fully furnished 1BHK apartment available for rent. Includes all modern amenities, Wi-Fi, and parking. Perfect for working professionals.',
        price: 25000,
        priceUnit: 'monthly',
        negotiable: true,
        address: '404 Urban Heights, Powai',
        locality: 'Powai',
        landmark: 'Near Tech Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400076',
        latitude: 19.1197,
        longitude: 72.9059,
        bedrooms: 1,
        bathrooms: 1,
        balconies: 1,
        floorNumber: 8,
        totalFloors: 15,
        superArea: 650,
        builtUpArea: 550,
        carpetArea: 500,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: userId,
        categoryId: categories.find(c => c.name === 'Residential')?.id || 1,
        subCategoryId: subcategories.find(s => s.name === 'Apartment')?.id || 1,
        propertyConfiguration: '3BHK',
        title: 'Luxury 3BHK with Sea View',
        slug: 'luxury-3bhk-with-sea-view',
        description: 'Premium 3BHK apartment with stunning sea view, premium fittings, and world-class amenities. Located in prestigious tower.',
        price: 12000000,
        priceUnit: 'total',
        negotiable: false,
        address: '505 Ocean Towers, Marine Drive',
        locality: 'Marine Drive',
        landmark: 'Queens Necklace',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400020',
        latitude: 18.9444,
        longitude: 72.8234,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        floorNumber: 20,
        totalFloors: 35,
        superArea: 1800,
        builtUpArea: 1500,
        carpetArea: 1350,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert properties
    await queryInterface.bulkInsert('properties', properties);

    // Create property features for each property
    const propertyFeatures = properties.map(property => ({
      id: uuidv4(),
      propertyId: property.id,
      parking: property.categoryId === categories.find(c => c.name === 'Residential')?.id,
      gym: property.price > 10000000,
      swimmingPool: property.price > 20000000,
      garden: property.subCategoryId === subcategories.find(s => s.name === 'Villa')?.id,
      playground: property.price > 15000000,
      clubhouse: property.price > 20000000,
      lift: property.totalFloors > 3,
      powerBackup: true,
      gasPipeline: property.categoryId === categories.find(c => c.name === 'Residential')?.id,
      waterSupply: true,
      wifi: property.priceUnit === 'monthly',
      airConditioning: property.price > 8000000,
      furnished: property.priceUnit === 'monthly',
      security: true,
      maintenance: property.categoryId === categories.find(c => c.name === 'Residential')?.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('propertyfeatures', propertyFeatures);

    console.log('✅ Properties seeded successfully!');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('propertyfeatures', null, {});
    await queryInterface.bulkDelete('properties', null, {});
    await queryInterface.bulkDelete('users', { email: 'demo@realstate.com' }, {});
  }
};
