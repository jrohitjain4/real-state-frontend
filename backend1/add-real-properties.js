const db = require('./models');
const { Property, Category, SubCategory, PropertyImage, User, sequelize } = db;

const realProperties = [
  // LUXURY HOMES
  {
    title: "Luxury 4BHK Villa with Swimming Pool",
    description: "Stunning 4BHK villa with modern amenities, private swimming pool, landscaped garden, and premium finishes. Located in prime residential area with excellent connectivity.",
    price: 35000000, // 3.5 Cr
    categoryId: 1, // Sell
    subCategoryId: 2, // Independent House/Villa
    bedrooms: 4,
    bathrooms: 5,
    superArea: 3500,
    carpetArea: 2800,
    city: "indore",
    locality: "Vijay Nagar",
    address: "Sector A, Vijay Nagar, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452010",
    furnishingStatus: "furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 0, // Ground floor villa
    totalFloors: 2,
    propertyAge: 1,
    images: [
      "/img/properties/luxury-villa-1.jpg",
      "/img/properties/luxury-villa-2.jpg",
      "/img/properties/luxury-villa-3.jpg"
    ]
  },
  {
    title: "Modern 3BHK Penthouse with Terrace Garden",
    description: "Spacious 3BHK penthouse with private terrace garden, modular kitchen, premium fixtures, and panoramic city views. Perfect for luxury living.",
    price: 28000000, // 2.8 Cr
    categoryId: 1, // Sell
    subCategoryId: 1, // Apartment/Flat
    bedrooms: 3,
    bathrooms: 4,
    superArea: 2200,
    carpetArea: 1800,
    city: "indore",
    locality: "Palasia",
    address: "AB Road, Palasia, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452001",
    furnishingStatus: "semi-furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 15,
    totalFloors: 15,
    propertyAge: 2,
    images: [
      "/img/properties/penthouse-1.jpg",
      "/img/properties/penthouse-2.jpg",
      "/img/properties/penthouse-3.jpg"
    ]
  },
  {
    title: "Premium 2BHK Apartment in Gated Community",
    description: "Well-designed 2BHK apartment in premium gated community with clubhouse, gym, swimming pool, and 24/7 security. Ready to move in.",
    price: 15000000, // 1.5 Cr
    categoryId: 1, // Sell
    subCategoryId: 1, // Apartment/Flat
    bedrooms: 2,
    bathrooms: 2,
    superArea: 1400,
    carpetArea: 1100,
    city: "lalitpiur",
    locality: "Sector 15",
    address: "Sector 15, Lalitpiur, UP",
    state: "Uttar Pradesh",
    pincode: "284403",
    furnishingStatus: "semi-furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 8,
    totalFloors: 12,
    propertyAge: 3,
    images: [
      "/img/properties/apartment-1.jpg",
      "/img/properties/apartment-2.jpg",
      "/img/properties/apartment-3.jpg"
    ]
  },
  {
    title: "Spacious 1BHK Studio Apartment",
    description: "Modern 1BHK studio apartment with contemporary design, fully furnished, and excellent ventilation. Perfect for young professionals.",
    price: 8500000, // 85 Lac
    categoryId: 1, // Sell
    subCategoryId: 1, // Apartment/Flat
    bedrooms: 1,
    bathrooms: 1,
    superArea: 800,
    carpetArea: 650,
    city: "indore",
    locality: "Scheme 78",
    address: "Scheme 78, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452010",
    furnishingStatus: "furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 5,
    totalFloors: 10,
    propertyAge: 1,
    images: [
      "/img/properties/studio-1.jpg",
      "/img/properties/studio-2.jpg"
    ]
  },

  // RENTAL PROPERTIES
  {
    title: "Fully Furnished 3BHK for Rent",
    description: "Spacious 3BHK apartment for rent with all modern amenities, AC in all rooms, modular kitchen, and parking space. Ideal for families.",
    price: 35000, // 35k per month
    categoryId: 2, // Rent
    subCategoryId: 4, // Apartment
    bedrooms: 3,
    bathrooms: 3,
    superArea: 1800,
    carpetArea: 1400,
    city: "indore",
    locality: "Bhawar Kuan",
    address: "Bhawar Kuan Square, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452014",
    furnishingStatus: "furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 4,
    totalFloors: 8,
    propertyAge: 5,
    images: [
      "/img/properties/rental-3bhk-1.jpg",
      "/img/properties/rental-3bhk-2.jpg",
      "/img/properties/rental-3bhk-3.jpg"
    ]
  },
  {
    title: "2BHK Apartment for Rent - Family Preferred",
    description: "Well-maintained 2BHK apartment for rent in peaceful locality. Semi-furnished with basic amenities and good connectivity to schools and hospitals.",
    price: 18000, // 18k per month
    categoryId: 2, // Rent
    subCategoryId: 4, // Apartment
    bedrooms: 2,
    bathrooms: 2,
    superArea: 1200,
    carpetArea: 950,
    city: "lalitpiur",
    locality: "Civil Lines",
    address: "Civil Lines, Lalitpiur, UP",
    state: "Uttar Pradesh",
    pincode: "284403",
    furnishingStatus: "semi-furnished",
    possessionStatus: "ready-to-move",
    floorNumber: 2,
    totalFloors: 4,
    propertyAge: 8,
    images: [
      "/img/properties/rental-2bhk-1.jpg",
      "/img/properties/rental-2bhk-2.jpg"
    ]
  },

  // LAND/PLOTS
  {
    title: "Premium Residential Plot in Developed Area",
    description: "Prime residential plot in fully developed area with all utilities available. Perfect for constructing your dream home. Clear title and ready for construction.",
    price: 12000000, // 1.2 Cr
    categoryId: 1, // Sell
    subCategoryId: 3, // Plot/Land
    plotArea: 2400, // 2400 sq ft
    city: "indore",
    locality: "Super Corridor",
    address: "Super Corridor, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452016",
    possessionStatus: "ready-to-move",
    propertyAge: 0,
    images: [
      "/img/properties/plot-1.jpg",
      "/img/properties/plot-2.jpg"
    ]
  },
  {
    title: "Agricultural Land for Sale",
    description: "Fertile agricultural land with water source and good road connectivity. Suitable for farming or future development. All documents clear.",
    price: 5000000, // 50 Lac
    categoryId: 1, // Sell
    subCategoryId: 3, // Plot/Land
    plotArea: 10000, // 10000 sq ft
    city: "lalitpiur",
    locality: "Tehsil Road",
    address: "Tehsil Road, Lalitpiur, UP",
    state: "Uttar Pradesh",
    pincode: "284404",
    possessionStatus: "ready-to-move",
    propertyAge: 0,
    images: [
      "/img/properties/agricultural-land-1.jpg",
      "/img/properties/agricultural-land-2.jpg"
    ]
  },
  {
    title: "Commercial Plot in Prime Location",
    description: "Strategic commercial plot on main road with high visibility and excellent footfall. Perfect for retail showroom, office, or mixed-use development.",
    price: 25000000, // 2.5 Cr
    categoryId: 1, // Sell
    subCategoryId: 3, // Plot/Land
    plotArea: 1800, // 1800 sq ft
    city: "indore",
    locality: "MG Road",
    address: "MG Road, Indore, MP",
    state: "Madhya Pradesh",
    pincode: "452001",
    possessionStatus: "ready-to-move",
    propertyAge: 0,
    images: [
      "/img/properties/commercial-plot-1.jpg",
      "/img/properties/commercial-plot-2.jpg"
    ]
  },

  // INDEPENDENT HOUSES
  {
    title: "Beautiful 3BHK Independent House",
    description: "Spacious independent house with front and back garden, parking for 2 cars, and peaceful neighborhood. Perfect for families seeking privacy and space.",
    price: 22000000, // 2.2 Cr
    categoryId: 1, // Sell
    subCategoryId: 2, // House/Villa
    bedrooms: 3,
    bathrooms: 3,
    superArea: 2000,
    carpetArea: 1600,
    plotArea: 1500,
    city: "lalitpiur",
    locality: "Model Town",
    address: "Model Town, Lalitpiur, UP",
    state: "Uttar Pradesh",
    pincode: "284403",
    furnishingStatus: "unfurnished",
    possessionStatus: "ready-to-move",
    floorNumber: 0,
    totalFloors: 2,
    propertyAge: 4,
    images: [
      "/img/properties/independent-house-1.jpg",
      "/img/properties/independent-house-2.jpg",
      "/img/properties/independent-house-3.jpg"
    ]
  }
];

async function addRealProperties() {
  try {
    console.log('🏠 Starting to add real properties to database...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Find or create a default user (property owner)
    let defaultUser = await User.findOne({ where: { email: 'owner@realestate.com' } });
    if (!defaultUser) {
      defaultUser = await User.create({
        name: 'Property Owner',
        email: 'owner@realestate.com',
        phone: '9876543210',
        password: 'hashedpassword', // In real app, this would be properly hashed
        role: 'user'
      });
      console.log('✅ Default user created');
    }

    let addedCount = 0;

    for (const propertyData of realProperties) {
      try {
        // Extract images from property data
        const { images, ...propertyInfo } = propertyData;

        // Add user ID
        propertyInfo.userId = defaultUser.id;

        // Generate slug from title
        propertyInfo.slug = propertyInfo.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') + '-' + Date.now();

        // Create property
        const property = await Property.create(propertyInfo);
        console.log(`✅ Created property: ${property.title}`);

        // Add images
        if (images && images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            await PropertyImage.create({
              propertyId: property.id,
              imageUrl: images[i],
              isPrimary: i === 0, // First image is primary
              order: i + 1
            });
          }
          console.log(`✅ Added ${images.length} images for property: ${property.title}`);
        }

        addedCount++;
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error adding property "${propertyData.title}":`, error.message);
      }
    }

    console.log(`\n🎉 Successfully added ${addedCount} real properties to database!`);
    console.log('\n📊 Properties Summary:');
    console.log('- Luxury Homes: 4 properties');
    console.log('- Rental Properties: 2 properties');
    console.log('- Land/Plots: 3 properties');
    console.log('- Independent Houses: 1 property');
    console.log('\n🌍 Cities: Indore (6 properties), Lalitpiur (4 properties)');
    console.log('\n💰 Price Range: ₹18,000/month to ₹3.5 Cr');

  } catch (error) {
    console.error('❌ Error adding properties:', error);
  } finally {
    await sequelize.close();
    console.log('✅ Database connection closed');
  }
}

// Run the script
addRealProperties();
