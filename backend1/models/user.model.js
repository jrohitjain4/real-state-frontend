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
            type: Sequelize.ENUM('user', 'admin', 'agent'),
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
        },
        // KYC and Profile fields
        profilePhoto: {
            type: Sequelize.STRING,
            allowNull: true
        },
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
        // Check all required KYC fields for profile completion
        const requiredFields = [
            'phoneNumber', 'address', 'city', 'state', 'pincode',
            'aadharNumber', 'panNumber'
        ];
        const isComplete = requiredFields.every(field => this[field] !== null && this[field] !== '');
        
        // Update the profileCompleted field
        this.profileCompleted = isComplete;
        if (isComplete && !this.profileCompletedAt) {
            this.profileCompletedAt = new Date();
        }
        
        return isComplete;
    };

    return User;
};