// models/user.model.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        // Basic fields (existing)
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
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
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        resetPasswordToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        resetPasswordExpires: {
            type: Sequelize.DATE,
            allowNull: true
        },
        lastLogin: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users'
    });

    // Hash password before creating
    User.beforeCreate(async (user, options) => {
        if (user.password && user.password !== 'google_oauth_user') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    // Method to check profile completion
    User.prototype.checkProfileCompletion = function() {
        const requiredFields = ['phoneNumber'];
        const isComplete = requiredFields.every(field => this[field] !== null && this[field] !== '');
        
        return isComplete;
    };

    return User;
};