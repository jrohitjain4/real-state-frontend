const db = require('./models');
const { Property } = db;

async function checkProperties() {
  try {
    const properties = await Property.findAll({
      include: [
        { model: db.Category, as: 'category' },
        { model: db.SubCategory, as: 'subcategory' },
        { model: db.PropertyImage, as: 'images' }
      ]
    });
    
    console.log('🏠 PROPERTIES IN DATABASE:');
    properties.forEach(prop => {
      console.log(`  📍 ${prop.title}`);
      console.log(`     💰 Price: ₹${prop.price.toLocaleString()}`);
      console.log(`     📋 Category: ${prop.category?.name}`);
      console.log(`     🏠 Type: ${prop.subcategory?.name}`);
      console.log(`     📍 Location: ${prop.city}, ${prop.state}`);
      console.log(`     📸 Images: ${prop.images?.length || 0}`);
      console.log('');
    });
    
    console.log(`✅ Total Properties: ${properties.length}`);
    await db.sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProperties();
