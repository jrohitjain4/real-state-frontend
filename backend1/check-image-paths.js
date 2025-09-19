const db = require('./models');

async function checkImagePaths() {
  try {
    const images = await db.PropertyImage.findAll({
      include: [{ model: db.Property, attributes: ['title'] }]
    });
    
    console.log('🖼️ PROPERTY IMAGES:');
    images.forEach(img => {
      console.log(`  📸 ${img.Property?.title}: ${img.imageUrl}`);
    });
    
    console.log(`\n✅ Total Images: ${images.length}`);
    await db.sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkImagePaths();
