// src/config/propertyFormConfig.js
export const propertyFormConfig = {
    residential: {
        basicInfo: ['title', 'description'],
        propertyDetails: ['bedrooms', 'bathrooms', 'balconies', 'floorNumber', 'totalFloors'],
        areaDetails: ['superArea', 'builtUpArea', 'carpetArea'],
        amenities: ['parking', 'lift', 'security', 'gym', 'swimmingPool', 'clubHouse', 'playArea', 'powerBackup', 'waterSupply'],
        additionalInfo: ['furnishingStatus', 'possessionStatus', 'ageOfProperty']
    },
    
    land: {
        basicInfo: ['title', 'description'],
        propertyDetails: [], // No bedroom/bathroom for land
        areaDetails: ['plotArea', 'plotLength', 'plotBreadth'], // Different area fields
        amenities: ['boundaryWall', 'waterConnection', 'electricityConnection'],
        additionalInfo: ['plotFacing', 'roadWidth', 'openSides']
    },
    
    commercial: {
        basicInfo: ['title', 'description'],
        propertyDetails: ['washrooms', 'floorNumber', 'totalFloors'],
        areaDetails: ['superArea', 'carpetArea'],
        amenities: ['parking', 'lift', 'security', 'powerBackup', 'centralAC', 'cafeteria'],
        additionalInfo: ['furnishingStatus', 'possessionStatus']
    },
    
    'commercial-land': {
        basicInfo: ['title', 'description'],
        propertyDetails: [],
        areaDetails: ['plotArea', 'frontage'],
        amenities: ['cornerProperty', 'mainRoadFacing'],
        additionalInfo: ['zoning', 'approvedUse']
    },
    
    farmhouse: {
        basicInfo: ['title', 'description'],
        propertyDetails: ['bedrooms', 'bathrooms'],
        areaDetails: ['totalArea', 'builtUpArea', 'openArea'],
        amenities: ['swimmingPool', 'garden', 'servantQuarter', 'guestHouse', 'borewell'],
        additionalInfo: ['furnishingStatus', 'possessionStatus']
    },
    
    studio: {
        basicInfo: ['title', 'description'],
        propertyDetails: ['bathrooms', 'floorNumber', 'totalFloors'], // No bedrooms for studio
        areaDetails: ['superArea', 'carpetArea'],
        amenities: ['parking', 'lift', 'security', 'gym', 'powerBackup'],
        additionalInfo: ['furnishingStatus', 'possessionStatus']
    },
    
    pg: {
        basicInfo: ['title', 'description'],
        propertyDetails: ['sharingType', 'totalBeds', 'availableBeds'],
        areaDetails: [],
        amenities: ['food', 'ac', 'wifi', 'laundry', 'housekeeping', 'powerBackup'],
        additionalInfo: ['gateClosingTime', 'visitorPolicy', 'securityDeposit', 'noticePeriod']
    },
    
    'agriculture-land': {
        basicInfo: ['title', 'description'],
        propertyDetails: [],
        areaDetails: ['plotArea', 'plotLength', 'plotBreadth'],
        amenities: ['waterConnection', 'electricityConnection', 'irrigationFacility', 'approachRoad'],
        additionalInfo: ['soilType', 'cropType', 'irrigationSource', 'landDocument']
    },
    
    'industrial-land': {
        basicInfo: ['title', 'description'],
        propertyDetails: [],
        areaDetails: ['plotArea', 'frontage'],
        amenities: ['powerConnection', 'waterConnection', 'approachRoad', 'security'],
        additionalInfo: ['zoning', 'environmentalClearance', 'industrialApproval']
    }
};

// Field definitions for dynamic form generation
export const fieldDefinitions = {
    // Land specific fields
    plotArea: {
        label: 'Plot Area (sq ft)',
        type: 'number',
        required: true,
        placeholder: 'e.g., 2400'
    },
    plotLength: {
        label: 'Plot Length (ft)',
        type: 'number',
        placeholder: 'e.g., 60'
    },
    plotBreadth: {
        label: 'Plot Breadth (ft)',
        type: 'number',
        placeholder: 'e.g., 40'
    },
    plotFacing: {
        label: 'Plot Facing',
        type: 'select',
        options: ['North', 'East', 'West', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
    },
    roadWidth: {
        label: 'Road Width (ft)',
        type: 'number',
        placeholder: 'e.g., 30'
    },
    openSides: {
        label: 'Open Sides',
        type: 'select',
        options: ['1', '2', '3', '4']
    },
    boundaryWall: {
        label: 'Boundary Wall',
        type: 'checkbox'
    },
    
    // Commercial specific fields
    washrooms: {
        label: 'Washrooms',
        type: 'number',
        defaultValue: 1
    },
    centralAC: {
        label: 'Central AC',
        type: 'checkbox'
    },
    cafeteria: {
        label: 'Cafeteria',
        type: 'checkbox'
    },
    zoning: {
        label: 'Zoning',
        type: 'select',
        options: ['Commercial', 'Industrial', 'Mixed Use']
    },
    approvedUse: {
        label: 'Approved Use',
        type: 'text',
        placeholder: 'e.g., Retail, Office, Warehouse'
    },
    
    // Farmhouse specific fields
    totalArea: {
        label: 'Total Area (acres)',
        type: 'number',
        required: true,
        step: 0.1
    },
    openArea: {
        label: 'Open Area (sq ft)',
        type: 'number'
    },
    garden: {
        label: 'Garden',
        type: 'checkbox'
    },
    servantQuarter: {
        label: 'Servant Quarter',
        type: 'checkbox'
    },
    guestHouse: {
        label: 'Guest House',
        type: 'checkbox'
    },
    borewell: {
        label: 'Borewell',
        type: 'checkbox'
    },
    
    // PG specific fields
    sharingType: {
        label: 'Sharing Type',
        type: 'select',
        options: ['Single', 'Double', 'Triple', 'Four or More'],
        required: true
    },
    totalBeds: {
        label: 'Total Beds',
        type: 'number',
        required: true
    },
    availableBeds: {
        label: 'Available Beds',
        type: 'number',
        required: true
    },
    food: {
        label: 'Food Available',
        type: 'select',
        options: ['Not Available', 'Veg Only', 'Veg & Non-Veg', 'Optional']
    },
    ac: {
        label: 'AC Available',
        type: 'checkbox'
    },
    wifi: {
        label: 'WiFi Available',
        type: 'checkbox'
    },
    laundry: {
        label: 'Laundry Service',
        type: 'checkbox'
    },
    housekeeping: {
        label: 'Housekeeping',
        type: 'checkbox'
    },
    gateClosingTime: {
        label: 'Gate Closing Time',
        type: 'time'
    },
    visitorPolicy: {
        label: 'Visitor Policy',
        type: 'select',
        options: ['Not Allowed', 'Limited Hours', 'Allowed']
    },
    noticePeriod: {
        label: 'Notice Period (days)',
        type: 'number',
        defaultValue: 30
    },
    
    // Agriculture Land specific fields
    soilType: {
        label: 'Soil Type',
        type: 'select',
        options: ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Laterite Soil', 'Mountain Soil', 'Desert Soil']
    },
    cropType: {
        label: 'Current Crop Type',
        type: 'select',
        options: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Pulses', 'Vegetables', 'Fruits', 'None']
    },
    irrigationSource: {
        label: 'Irrigation Source',
        type: 'select',
        options: ['Borewell', 'Canal', 'River', 'Lake', 'Rainfed', 'Mixed']
    },
    irrigationFacility: {
        label: 'Irrigation Facility',
        type: 'checkbox'
    },
    approachRoad: {
        label: 'Approach Road',
        type: 'checkbox'
    },
    landDocument: {
        label: 'Land Document Type',
        type: 'select',
        options: ['Patta', 'Settlement Deed', 'Gift Deed', 'Sale Deed', 'Lease Deed', 'Other']
    },
    
    // Industrial Land specific fields
    environmentalClearance: {
        label: 'Environmental Clearance',
        type: 'checkbox'
    },
    industrialApproval: {
        label: 'Industrial Approval',
        type: 'checkbox'
    },
    powerConnection: {
        label: 'Power Connection',
        type: 'checkbox'
    }
};