// models/index.js
'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    {
        host: config[env].host,
        dialect: config[env].dialect,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.User = require('./user.model.js')(sequelize, Sequelize);
db.Category = require('./category.model.js')(sequelize, Sequelize);
db.SubCategory = require('./subcategory.model.js')(sequelize, Sequelize);
db.Property = require('./property.model.js')(sequelize, Sequelize);
db.PropertyImage = require('./propertyImage.model.js')(sequelize, Sequelize);
db.PropertyFeature = require('./propertyFeature.model.js')(sequelize, Sequelize);

// Define associations
// Category - SubCategory
db.Category.hasMany(db.SubCategory, { foreignKey: 'categoryId', as: 'subcategories' });
db.SubCategory.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

// Category - Property
db.Category.hasMany(db.Property, { foreignKey: 'categoryId', as: 'properties' });
db.Property.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

// SubCategory - Property
db.SubCategory.hasMany(db.Property, { foreignKey: 'subCategoryId', as: 'properties' });
db.Property.belongsTo(db.SubCategory, { foreignKey: 'subCategoryId', as: 'subcategory' });


// User - Property
db.User.hasMany(db.Property, { foreignKey: 'userId', as: 'properties' });
db.Property.belongsTo(db.User, { foreignKey: 'userId', as: 'owner' });

// Property - PropertyImage
db.Property.hasMany(db.PropertyImage, { foreignKey: 'propertyId', as: 'images' });
db.PropertyImage.belongsTo(db.Property, { foreignKey: 'propertyId' });

// Property - PropertyFeature (One to One)
db.Property.hasOne(db.PropertyFeature, { foreignKey: 'propertyId', as: 'features' });
db.PropertyFeature.belongsTo(db.Property, { foreignKey: 'propertyId' });

module.exports = db;