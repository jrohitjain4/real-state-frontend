const db = require('./models');

async function checkImageLinks() {
    try {
        console.log('Checking image-property links...');
        
        // Check all property images in database
        const propertyImages = await db.PropertyImage.findAll({
            include: [
                {
                    model: db.Property,
                    attributes: ['id', 'title', 'slug']
                }
            ]
        });
        
        console.log(`Found ${propertyImages.length} property images in database:`);
        
        propertyImages.forEach((img, index) => {
            console.log(`\n${index + 1}. Image: ${img.imageUrl}`);
            console.log(`   Property ID: ${img.propertyId}`);
            console.log(`   Property Title: ${img.Property?.title || 'PROPERTY NOT FOUND'}`);
            console.log(`   Is Primary: ${img.isPrimary}`);
            console.log(`   Type: ${img.imageType}`);
        });
        
        // Check if there are orphaned files
        const fs = require('fs');
        const uploadsPath = './uploads/properties';
        
        if (fs.existsSync(uploadsPath)) {
            const files = fs.readdirSync(uploadsPath);
            console.log(`\n--- UPLOADED FILES (${files.length}) ---`);
            
            files.forEach(file => {
                const linkedImage = propertyImages.find(img => img.imageUrl.includes(file));
                console.log(`${file} -> ${linkedImage ? 'LINKED' : 'ORPHANED'}`);
            });
        }
        
        // Find properties with images
        const propertiesWithImages = await db.Property.findAll({
            include: [
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: true // Only properties with images
                }
            ]
        });
        
        console.log(`\n--- PROPERTIES WITH IMAGES (${propertiesWithImages.length}) ---`);
        propertiesWithImages.forEach(prop => {
            console.log(`${prop.title} -> ${prop.images.length} image(s)`);
        });
        
    } catch (error) {
        console.error('Error checking image links:', error);
    } finally {
        process.exit();
    }
}

checkImageLinks();
