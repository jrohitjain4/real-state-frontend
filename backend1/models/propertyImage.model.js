// models/propertyImage.model.js
module.exports = (sequelize, Sequelize) => {
    const PropertyImage = sequelize.define('PropertyImage', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        propertyId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'properties',
                key: 'id'
            }
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageType: {
            type: Sequelize.ENUM(
                'exterior',
                'living-room',
                'bedroom',
                'bathroom',
                'kitchen',
                'balcony',
                'floor-plan',
                'location-map',
                'other'
            ),
            defaultValue: 'other'
        },
        isPrimary: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        caption: {
            type: Sequelize.STRING,
            allowNull: true
        },
        order: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'property_images'
    });

    return PropertyImage;
};