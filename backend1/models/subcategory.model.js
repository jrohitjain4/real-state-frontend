// models/subcategory.model.js
module.exports = (sequelize, Sequelize) => {
    const SubCategory = sequelize.define('SubCategory', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        displayOrder: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        // Property specific fields
        minBedrooms: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        maxBedrooms: {
            type: Sequelize.INTEGER,
            defaultValue: 10
        },
        allowCommercial: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'subcategories',
        indexes: [
            {
                unique: true,
                fields: ['categoryId', 'slug']
            }
        ]
    });

    return SubCategory;
};