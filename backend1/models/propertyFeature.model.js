module.exports = (sequelize, Sequelize) => {
    const PropertyFeature = sequelize.define('PropertyFeature', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        propertyId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'properties',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        // Parking
        parking: {
            type: Sequelize.ENUM('none', 'bike', 'car', 'both'),
            defaultValue: 'none'
        },
        parkingCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        
        // Power & Water
        powerBackup: {
            type: Sequelize.ENUM('none', 'partial', 'full'),
            defaultValue: 'none'
        },
        waterSupply: {
            type: Sequelize.ENUM('corporation', 'borewell', 'both'),
            defaultValue: 'corporation'
        },
        
        // Basic Amenities
        lift: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        security: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        cctv: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // Lifestyle Amenities
        gym: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        swimmingPool: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        clubHouse: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        playArea: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // Other Features
        gasConnection: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        vastu: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        petFriendly: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        intercom: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        visitorParking: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        boundaryWall: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        waterConnection: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        electricityConnection: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // Commercial specific
        centralAC: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        cafeteria: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // Farmhouse specific
        garden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        servantQuarter: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        guestHouse: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        borewell: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // PG specific
        food: {
            type: Sequelize.STRING,
            allowNull: true
        },
        ac: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        wifi: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        laundry: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        housekeeping: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // Additional features
        cornerProperty: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        mainRoadFacing: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        
        // ... existing fields ...
    }, {
        tableName: 'property_features'
    });

    return PropertyFeature;
};
   