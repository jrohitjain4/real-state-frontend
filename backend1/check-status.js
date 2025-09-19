const db = require('./models');

async function checkStatus() {
  try {
    const properties = await db.Property.findAll({
      attributes: ['id', 'title', 'slug', 'status'],
      limit: 5
    });
    
    console.log('🏠 Properties Status:');
    properties.forEach(prop => {
      console.log(`  ${prop.title}: ${prop.status || 'NULL'}`);
      console.log(`  Slug: ${prop.slug}`);
      console.log('');
    });
    
    await db.sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStatus();
