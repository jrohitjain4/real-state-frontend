// data/mockPropertyData.js

export const MOCK_PROPERTIES = [
  // Bangalore Properties
  {
    id: 1,
    projectName: "Prestige Waterford",
    builderName: "Prestige Group",
    builderLogo: "https://placehold.co/100x100?text=Prestige",
    marketedBy: "Prestige Estates Projects Ltd",
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    configurations: ["3 BHK", "4 BHK"],
    priceRange: {
      min: 14500000,
      max: 28500000,
      label: "₹ 1.45 Cr onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Prestige+Waterford",
    propertyType: "Flat",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 2,
    projectName: "Sobha Dream Acres",
    builderName: "Sobha Limited",
    builderLogo: "https://placehold.co/100x100?text=Sobha",
    marketedBy: "Sobha Limited",
    location: "Marathahalli, Bangalore",
    city: "Bangalore",
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    priceRange: {
      min: 8500000,
      max: 18500000,
      label: "₹ 85 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Sobha+Dream+Acres",
    propertyType: "Flat",
    status: "Under Construction",
    featured: true
  },
  {
    id: 3,
    projectName: "Brigade Eldorado",
    builderName: "Brigade Group",
    builderLogo: "https://placehold.co/100x100?text=Brigade",
    marketedBy: "Brigade Enterprises Ltd",
    location: "Huvinayakanahalli, Bangalore",
    city: "Bangalore",
    configurations: ["1 BHK", "2 BHK", "3 BHK"],
    priceRange: {
      min: 4500000,
      max: 12500000,
      label: "₹ 45 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Brigade+Eldorado",
    propertyType: "Flat",
    status: "New Launch",
    featured: true
  },
  
  // Mumbai Properties
  {
    id: 4,
    projectName: "Lodha Palava",
    builderName: "Lodha Group",
    builderLogo: "https://placehold.co/100x100?text=Lodha",
    marketedBy: "Macrotech Developers Ltd",
    location: "Dombivali, Mumbai",
    city: "Mumbai",
    configurations: ["1 BHK", "2 BHK", "3 BHK"],
    priceRange: {
      min: 3500000,
      max: 9500000,
      label: "₹ 35 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Lodha+Palava",
    propertyType: "Flat",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 5,
    projectName: "Godrej The Trees",
    builderName: "Godrej Properties",
    builderLogo: "https://placehold.co/100x100?text=Godrej",
    marketedBy: "Godrej Properties Limited",
    location: "Vikhroli, Mumbai",
    city: "Mumbai",
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    priceRange: {
      min: 22500000,
      max: 45500000,
      label: "₹ 2.25 Cr onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Godrej+Trees",
    propertyType: "Flat",
    status: "Under Construction",
    featured: true
  },
  
  // Delhi Properties
  {
    id: 6,
    projectName: "DLF The Camellias",
    builderName: "DLF Limited",
    builderLogo: "https://placehold.co/100x100?text=DLF",
    marketedBy: "DLF Limited",
    location: "Sector 42, Gurgaon",
    city: "Gurgaon",
    configurations: ["4 BHK", "5 BHK"],
    priceRange: {
      min: 65000000,
      max: 150000000,
      label: "₹ 6.5 Cr onwards"
    },
    mainImage: "https://placehold.co/600x400?text=DLF+Camellias",
    propertyType: "Flat",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 7,
    projectName: "M3M Golf Estate",
    builderName: "M3M India",
    builderLogo: "https://placehold.co/100x100?text=M3M",
    marketedBy: "M3M India Private Limited",
    location: "Sector 65, Gurgaon",
    city: "Gurgaon",
    configurations: ["3 BHK", "4 BHK", "5 BHK"],
    priceRange: {
      min: 25000000,
      max: 55000000,
      label: "₹ 2.5 Cr onwards"
    },
    mainImage: "https://placehold.co/600x400?text=M3M+Golf+Estate",
    propertyType: "Flat",
    status: "New Launch",
    featured: true
  },
  
  // Pune Properties
  {
    id: 8,
    projectName: "Kolte Patil Life Republic",
    builderName: "Kolte Patil",
    builderLogo: "https://placehold.co/100x100?text=KoltePatil",
    marketedBy: "Kolte Patil Developers Ltd",
    location: "Hinjewadi, Pune",
    city: "Pune",
    configurations: ["1 BHK", "2 BHK", "3 BHK"],
    priceRange: {
      min: 3500000,
      max: 8500000,
      label: "₹ 35 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Life+Republic",
    propertyType: "Flat",
    status: "Under Construction",
    featured: true
  },
  
  // Chennai Properties
  {
    id: 9,
    projectName: "Casagrand Utopia",
    builderName: "Casagrand",
    builderLogo: "https://placehold.co/100x100?text=Casagrand",
    marketedBy: "Casagrand Builder Private Limited",
    location: "Manapakkam, Chennai",
    city: "Chennai",
    configurations: ["2 BHK", "3 BHK"],
    priceRange: {
      min: 6500000,
      max: 12500000,
      label: "₹ 65 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=Casagrand+Utopia",
    propertyType: "Flat",
    status: "Ready to Move",
    featured: true
  },
  
  // Hyderabad Properties
  {
    id: 10,
    projectName: "My Home Vihanga",
    builderName: "My Home Constructions",
    builderLogo: "https://placehold.co/100x100?text=MyHome",
    marketedBy: "My Home Constructions Private Limited",
    location: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    priceRange: {
      min: 8500000,
      max: 18500000,
      label: "₹ 85 Lac onwards"
    },
    mainImage: "https://placehold.co/600x400?text=MyHome+Vihanga",
    propertyType: "Flat",
    status: "Under Construction",
    featured: true
  },
  
  // Add more properties for other cities...
];

// Function to get properties by city
export const getPropertiesByCity = (cityName) => {
  return MOCK_PROPERTIES.filter(property => 
    property.city.toLowerCase() === cityName.toLowerCase()
  );
};

// Function to get featured properties by city
export const getFeaturedPropertiesByCity = (cityName) => {
  return MOCK_PROPERTIES.filter(property => 
    property.city.toLowerCase() === cityName.toLowerCase() && property.featured
  );
};

// Function to filter properties based on search criteria
export const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    // Filter by property type
    if (filters.propertyType && filters.propertyType !== 'all') {
      if (property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false;
      }
    }
    
    // Filter by budget range
    if (filters.budgetRange) {
      const { min, max } = filters.budgetRange;
      if (min && property.priceRange.min < parseInt(min)) {
        return false;
      }
      if (max && property.priceRange.min > parseInt(max)) {
        return false;
      }
    }
    
    // Filter by configuration (BHK)
    if (filters.propertySubType) {
      const bhkFilter = filters.propertySubType.replace('+', '');
      if (!property.configurations.some(config => config === bhkFilter)) {
        return false;
      }
    }
    
    // Filter by search query (location, project name)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        property.projectName.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.builderName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};