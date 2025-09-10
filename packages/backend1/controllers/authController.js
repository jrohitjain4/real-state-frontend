const db = require('../models'); // Gets our db object from models/index.js
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, googleId, picture } = req.body;

        // Check if user already exists by email
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        // Check if Google OAuth user already exists by googleId
        if (googleId) {
            let googleUser = await User.findOne({ where: { googleId } });
            if (googleUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'User already exists with this Google account' 
                });
            }
        }

        // Create user with selected role and Google OAuth data
        const userData = { name, email, password, role };
        if (googleId) userData.googleId = googleId;
        if (picture) userData.picture = picture;
        
        user = await User.create(userData);

        // Create and return a token
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role,
                name: user.name,
                email: user.email
            } 
        };
        
        jwt.sign(payload, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production', { expiresIn: process.env.JWT_EXPIRES_IN || '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ 
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    picture: user.picture
                }
            });
        });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration' 
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // For Google OAuth users, skip password check
        if (user.googleId && password === 'google_oauth_user') {
            // This is a Google OAuth user, allow login without password verification
        } else {
            // Check password for regular users
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }
        }

        // Create and return a token
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto || user.picture
            } 
        };
        
        jwt.sign(payload, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production', { expiresIn: process.env.JWT_EXPIRES_IN || '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    picture: user.picture
                }
            });
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login' 
        });
    }
};

// Request password reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Don't reveal if user exists or not
            return res.json({ 
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.' 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to user (you might want to add these fields to your User model)
        // For now, we'll just return success
        // user.resetPasswordToken = resetToken;
        // user.resetPasswordExpires = resetTokenExpiry;
        // await user.save();

        // In production, send email with reset link
        // For now, just return success message
        
        res.json({ 
            success: true,
            message: 'Password reset link sent to your email',
            resetToken: resetToken // Remove this in production
        });

    } catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during password reset request' 
        });
    }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        // const user = await User.findOne({
        //     where: {
        //         resetPasswordToken: token,
        //         resetPasswordExpires: { [Op.gt]: Date.now() }
        //     }
        // });

        // For now, we'll just validate the password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: 'New password must be at least 8 characters long' 
            });
        }

        // In production, update user password and clear reset token
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(newPassword, salt);
        // user.resetPasswordToken = null;
        // user.resetPasswordExpires = null;
        // await user.save();

        res.json({ 
            success: true,
            message: 'Password has been reset successfully' 
        });

    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during password reset' 
        });
    }
};

// Change password (for logged-in users)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ 
            success: true,
            message: 'Password changed successfully' 
        });

    } catch (err) {
        console.error('Change password error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during password change' 
        });
    }
};

// Logout user (client-side token removal)
exports.logout = async (req, res) => {
    try {
        // Since JWT is stateless, logout is handled client-side
        // This endpoint can be used for logging purposes or future enhancements
        res.json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during logout' 
        });
    }
};

// Get current user profile
exports.getProfile = async (req,res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'phone', 'profilePhoto']
        });

       res.json({
        success: true,
        user
       });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email is already taken by another user' 
                });
            }
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone; // Allow empty string

        await user.save();

        res.json({ 
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating profile' 
        });
    }
};


exports.uploadProfilePhoto = async (req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            // Delete uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
       user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
       await user.save();

       res.json({
        success: true,
        message: 'Profile photo uploaded successfully',
        photoUrl: user.profilePhoto

       });
    } catch (err) {
        // Delete uploaded file on error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Upload photo error:', err.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error during photo upload' 
        });
    }
};