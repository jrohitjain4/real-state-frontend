const db = require('./models');

async function checkPropertyImages() {
    try {
        console.log('Checking properties and their images...');
        
        const properties = await db.Property.findAll({
            include: [
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: false
                }
            ],
            limit: 5
        });
        
        console.log(`Found ${properties.length} properties:`);
        
        properties.forEach((property, index) => {
            console.log(`\n${index + 1}. ${property.title}`);
            console.log(`   ID: ${property.id}`);
            console.log(`   Images: ${property.images ? property.images.length : 0}`);
            
            if (property.images && property.images.length > 0) {
                property.images.forEach((img, imgIndex) => {
                    console.log(`     ${imgIndex + 1}. ${img.imageUrl} (Primary: ${img.isPrimary})`);
                });
            } else {
                console.log('     No images found');
            }
        });
        
        // Check uploads directory
        const fs = require('fs');
        const uploadsPath = './uploads/properties';
        
        if (fs.existsSync(uploadsPath)) {
            const files = fs.readdirSync(uploadsPath);
            console.log(`\nUploaded files in ${uploadsPath}: ${files.length}`);
            files.forEach(file => console.log(`  - ${file}`));
        } else {
            console.log(`\nUploads directory ${uploadsPath} does not exist`);
        }
        
    } catch (error) {
        console.error('Error checking property images:', error);
    } finally {
        process.exit();
    }
}

checkPropertyImages();
