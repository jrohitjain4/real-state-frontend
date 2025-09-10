'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';

// Database connection
const sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    {
        host: config[env].host,
        dialect: config[env].dialect,
        logging: false, // Set true to see SQL queries
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

// Import models
db.User = require('./user.model.js')(sequelize, Sequelize);
// Add more models here if needed
// db.Product = require('./product.model.js')(sequelize, Sequelize);

// Define associations here if any
// Example:
// db.User.hasMany(db.Product);
// db.Product.belongsTo(db.User);

module.exports = db;