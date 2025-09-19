const db = require('./models');

async function updatePropertyStatus() {
  try {
    // Update all properties with good titles to active status
    const result = await db.Property.update(
      { status: 'active' },
      { 
        where: {
          title: {
            [db.Sequelize.Op.notIn]: ['1bhk', '1BHK', 'test', 'Test Property']
          }
        }
      }
    );
    
    console.log(`✅ Updated ${result[0]} properties to active status`);
    
    // Show updated properties
    const properties = await db.Property.findAll({
      attributes: ['id', 'title', 'slug', 'status'],
      where: { status: 'active' }
    });
    
    console.log('\n🏠 Active Properties:');
    properties.forEach(prop => {
      console.log(`  ✅ ${prop.title} (${prop.slug})`);
    });
    
    await db.sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updatePropertyStatus();
