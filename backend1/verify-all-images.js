const db = require('./models');

async function verifyAllImages() {
    try {
        console.log('Verifying all property images...');
        
        // Get all properties with their images
        const properties = await db.Property.findAll({
            include: [
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: false,
                    attributes: ['imageUrl', 'isPrimary', 'order', 'imageType']
                },
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        console.log(`\n=== PROPERTY IMAGE VERIFICATION (${properties.length} properties) ===`);
        
        properties.forEach((property, index) => {
            console.log(`\n${index + 1}. "${property.title}" (${property.category.name})`);
            console.log(`   ID: ${property.id}`);
            console.log(`   Status: ${property.status}`);
            
            if (property.images && property.images.length > 0) {
                console.log(`   ✅ HAS ${property.images.length} IMAGE(S):`);
                property.images.forEach((img, imgIndex) => {
                    console.log(`      ${imgIndex + 1}. ${img.imageUrl}`);
                    console.log(`         Primary: ${img.isPrimary ? '✅ YES' : '❌ NO'}`);
                    console.log(`         Type: ${img.imageType}`);
                    console.log(`         Order: ${img.order}`);
                });
                
                // Check which image would be shown in listing
                const primaryImage = property.images.find(img => img.isPrimary);
                const displayImage = primaryImage || property.images[0];
                console.log(`   🖼️  WILL DISPLAY: ${displayImage.imageUrl} (${displayImage.isPrimary ? 'Primary' : 'First Available'})`);
            } else {
                console.log(`   ❌ NO IMAGES - Will show placeholder`);
            }
        });
        
        // Summary
        const propertiesWithImages = properties.filter(p => p.images && p.images.length > 0);
        const propertiesWithPrimaryImages = properties.filter(p => p.images && p.images.some(img => img.isPrimary));
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Total Properties: ${properties.length}`);
        console.log(`With Images: ${propertiesWithImages.length}`);
        console.log(`With Primary Images: ${propertiesWithPrimaryImages.length}`);
        console.log(`Without Images: ${properties.length - propertiesWithImages.length} (will show placeholders)`);
        
    } catch (error) {
        console.error('Error verifying images:', error);
    } finally {
        process.exit();
    }
}

verifyAllImages();
