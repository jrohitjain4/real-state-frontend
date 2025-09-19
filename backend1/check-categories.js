const db = require('./models');
const { Category, SubCategory, sequelize } = db;

async function checkData() {
  try {
    const categories = await Category.findAll();
    const subcategories = await SubCategory.findAll();
    
    console.log('📋 CATEGORIES:');
    categories.forEach(cat => console.log(`  ${cat.id}: ${cat.name}`));
    
    console.log('\n🏠 SUBCATEGORIES:');
    subcategories.forEach(sub => console.log(`  ${sub.id}: ${sub.name} (Category: ${sub.categoryId})`));
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();
