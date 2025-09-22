// models/property.model.js
module.exports = (sequelize, Sequelize) => {
    const Property = sequelize.define('Property', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        
        // Reference to dynamic categories
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        subCategoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'subcategories',
                key: 'id'
            }
        },
        propertyConfiguration: {
            type: Sequelize.STRING,
            allowNull: true, // For plots it will be null
        },
        
        // Basic Information
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        slug: {
            type: Sequelize.STRING,
            unique: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        
        // Location Details
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        locality: {
            type: Sequelize.STRING,
            allowNull: false
        },
        landmark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pincode: {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: true
        },
        
        // Property Details
        bedrooms: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        bathrooms: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        balconies: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        floorNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        totalFloors: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // Area Details
        superArea: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        builtUpArea: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carpetArea: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // Pricing
        price: {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: false
        },
        priceUnit: {
            type: Sequelize.ENUM('total', 'per-sqft', 'per-sqyard', 'per-month'),
            defaultValue: 'total'
        },
        negotiable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        
        // For Rent
        rentAmount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        securityDeposit: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        maintenanceCharge: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        
        // Additional Details
        furnishingStatus: {
            type: Sequelize.ENUM('furnished', 'semi-furnished', 'unfurnished'),
            defaultValue: 'unfurnished'
        },
        possessionStatus: {
            type: Sequelize.ENUM('ready-to-move', 'under-construction'),
            defaultValue: 'ready-to-move'
        },
        availableFrom: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        ageOfProperty: {
            type: Sequelize.ENUM('new', '1-3years', '3-5years', '5-10years', '10plus'),
            defaultValue: 'new'
        },
        
        // Owner
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ownershipType: {
            type: Sequelize.ENUM('owner', 'dealer', 'builder'),
            defaultValue: 'owner'
        },
        
        // Status & Verification
        status: {
            type: Sequelize.ENUM('draft', 'pending', 'active', 'inactive', 'sold', 'rented'),
            defaultValue: 'pending'
        },
       
        
        // Stats
        viewCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        isFeatured: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // SEO
        metaTitle: {
            type: Sequelize.STRING,
            allowNull: true
        },
        metaDescription: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        propertyType: {
            type: Sequelize.ENUM('residential', 'land', 'commercial', 'commercial-land', 'farmhouse', 'studio', 'pg'),
            allowNull: true
        },
        property_for: {
            type: Sequelize.ENUM('commercial', 'residential'),
            allowNull: false,
            defaultValue: 'residential'
        },
        
        // Land specific fields
        plotArea: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        plotLength: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        plotBreadth: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        plotFacing: {
            type: Sequelize.STRING,
            allowNull: true
        },
        roadWidth: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        openSides: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        // Commercial specific
        washrooms: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frontage: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // Farmhouse specific
        totalArea: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        openArea: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // PG specific
        sharingType: {
            type: Sequelize.ENUM('Single', 'Double', 'Triple', 'Four or More'),
            allowNull: true
        },
        totalBeds: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        availableBeds: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        gateClosingTime: {
            type: Sequelize.TIME,
            allowNull: true
        },
        visitorPolicy: {
            type: Sequelize.ENUM('Not Allowed', 'Limited Hours', 'Allowed'),
            allowNull: true
        },
        noticePeriod: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // Additional fields for land
        zoning: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvedUse: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        // ... rest of existing fields ...
    }, {
        tableName: 'properties'
    });

    return Property;
};