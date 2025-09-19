const db = require('./models');

async function checkSlug() {
  try {
    const properties = await db.Property.findAll({
      attributes: ['id', 'title', 'slug'],
      limit: 5
    });
    
    console.log('🏠 Sample Properties:');
    properties.forEach(prop => {
      console.log(`  ID: ${prop.id}`);
      console.log(`  Title: ${prop.title}`);
      console.log(`  Slug: ${prop.slug}`);
      console.log('');
    });
    
    await db.sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSlug();
