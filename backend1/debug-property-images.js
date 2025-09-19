const db = require('./models');

async function debugPropertyImages() {
    try {
        console.log('Debugging property images API response...');
        
        // Simulate the same query as getAllProperties
        const properties = await db.Property.findAll({
            where: {
                status: { [db.Sequelize.Op.in]: ['active', 'pending'] }
            },
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: false,
                    attributes: ['imageUrl', 'isPrimary', 'order']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        
        console.log(`\n=== API RESPONSE SIMULATION (${properties.length} properties) ===`);
        
        properties.forEach((property, index) => {
            console.log(`\n${index + 1}. Property: "${property.title}"`);
            console.log(`   ID: ${property.id}`);
            console.log(`   Category: ${property.category.name}`);
            
            if (property.images && property.images.length > 0) {
                console.log(`   ✅ IMAGES (${property.images.length}):`);
                property.images.forEach((img, imgIndex) => {
                    console.log(`      ${imgIndex + 1}. ${img.imageUrl} (Primary: ${img.isPrimary})`);
                });
                
                // Show what would be displayed in frontend
                const primaryImage = property.images.find(img => img.isPrimary);
                const imageToShow = primaryImage || property.images[0];
                console.log(`   🖼️  FRONTEND WILL SHOW: ${imageToShow.imageUrl}`);
            } else {
                console.log(`   ❌ NO IMAGES - Will show placeholder`);
                console.log(`   🖼️  FRONTEND WILL SHOW: /img/portfolio/01-small.jpg`);
            }
        });
        
        // Check if there's a pattern issue
        const uniqueImages = new Set();
        const imageCount = {};
        
        properties.forEach(property => {
            if (property.images && property.images.length > 0) {
                const primaryImage = property.images.find(img => img.isPrimary);
                const imageToShow = primaryImage || property.images[0];
                const imageUrl = imageToShow.imageUrl;
                
                uniqueImages.add(imageUrl);
                imageCount[imageUrl] = (imageCount[imageUrl] || 0) + 1;
            }
        });
        
        console.log(`\n=== IMAGE DISTRIBUTION ANALYSIS ===`);
        console.log(`Unique images: ${uniqueImages.size}`);
        console.log(`Image usage:`);
        Object.entries(imageCount).forEach(([url, count]) => {
            console.log(`  ${url} -> Used by ${count} properties ${count > 1 ? '⚠️  DUPLICATE!' : '✅'}`);
        });
        
    } catch (error) {
        console.error('Error debugging images:', error);
    } finally {
        process.exit();
    }
}

debugPropertyImages();
