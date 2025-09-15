// models/user.model.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        // Basic fields (existing)
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
        },
        profilePhoto: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        
        // KYC fields
        aadharNumber: {
            type: Sequelize.STRING(12),
            allowNull: true
        },
        aadharPhoto: {
            type: Sequelize.STRING,
            allowNull: true
        },
        panNumber: {
            type: Sequelize.STRING(10),
            allowNull: true
        },
        panPhoto: {
            type: Sequelize.STRING,
            allowNull: true
        },
        
        // Address fields
        address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pincode: {
            type: Sequelize.STRING(6),
            allowNull: true
        },
        
        // Profile status
        profileCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        kycVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        profileCompletedAt: {
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
        const requiredFields = ['phone', 'aadharNumber', 'panNumber', 'address', 'city', 'state', 'pincode'];
        const isComplete = requiredFields.every(field => this[field] !== null && this[field] !== '');
        
        if (isComplete && !this.profileCompleted) {
            this.profileCompleted = true;
            this.profileCompletedAt = new Date();
        }
        
        return isComplete;
    };

    return User;
};