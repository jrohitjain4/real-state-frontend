// This file centralizes your database connection details.
// It reads from the .env file to keep secrets safe.
module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'your_password',
    DB: process.env.DB_NAME || 'real_state',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};