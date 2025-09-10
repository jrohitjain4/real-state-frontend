const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        googleId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            unique: true
        },
        picture: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'users' // Explicitly set table name to 'users'
    });

    // Hook to hash password before creating a user (skip for Google OAuth users)
    User.beforeCreate(async (user, options) => {
        // Only hash password if it's not a Google OAuth user
        if (user.password && user.password !== 'google_oauth_user') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    return User;
};