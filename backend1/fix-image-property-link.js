const db = require('./models');

async function fixImagePropertyLink() {
    try {
        console.log('Checking and fixing image-property links...');
        
        // Find the orphaned image
        const orphanedImage = await db.PropertyImage.findOne({
            where: { propertyId: '6b4e997d-5e8c-41d4-b0ac-21c9e50219f8' }
        });
        
        if (orphanedImage) {
            console.log('Found orphaned image:', orphanedImage.imageUrl);
            
            // Check if this property ID exists
            const property = await db.Property.findByPk('6b4e997d-5e8c-41d4-b0ac-21c9e50219f8');
            
            if (!property) {
                console.log('Property with this ID does not exist!');
                
                // Find a property that matches "1bhk" title
                const targetProperty = await db.Property.findOne({
                    where: { title: '1bhk' }
                });
                
                if (targetProperty) {
                    console.log(`Found target property: ${targetProperty.title} (ID: ${targetProperty.id})`);
                    
                    // Update the image to link to the correct property
                    await orphanedImage.update({
                        propertyId: targetProperty.id,
                        isPrimary: true // Make it primary so it shows in listing
                    });
                    
                    console.log('✅ Image linked to correct property and set as primary!');
                } else {
                    console.log('❌ No matching property found for 1bhk');
                }
            } else {
                console.log('Property exists, just setting image as primary...');
                await orphanedImage.update({ isPrimary: true });
                console.log('✅ Image set as primary!');
            }
        } else {
            console.log('No orphaned image found');
        }
        
        // Show final result
        const propertiesWithImages = await db.Property.findAll({
            include: [
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: false
                }
            ],
            where: {
                title: '1bhk'
            }
        });
        
        console.log('\n--- FINAL RESULT ---');
        propertiesWithImages.forEach(prop => {
            console.log(`Property: ${prop.title} (${prop.id})`);
            prop.images.forEach(img => {
                console.log(`  Image: ${img.imageUrl} (Primary: ${img.isPrimary})`);
            });
        });
        
    } catch (error) {
        console.error('Error fixing image links:', error);
    } finally {
        process.exit();
    }
}

fixImagePropertyLink();
