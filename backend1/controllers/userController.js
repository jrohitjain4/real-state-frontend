const db = require('../models');
const User = db.User;

// Get user dashboard data
exports.getUserDashboardData = async (req, res) => {
    try {
        res.json({ 
            msg: `Welcome ${req.user.name}! This is your user dashboard.`,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get admin dashboard data
exports.getAdminDashboardData = async (req, res) => {
    try {
        const userCount = await User.count();
        const adminCount = await User.count({ where: { role: 'admin' } });
        const regularUserCount = await User.count({ where: { role: 'user' } });
        
        res.json({ 
            msg: `Welcome Admin ${req.user.name}!`,
            stats: {
                totalUsers: userCount,
                adminUsers: adminCount,
                regularUsers: regularUserCount
            },
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        
        await user.save();
        res.json({ msg: 'User updated successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        await user.destroy();
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

function calculateProfileCompletion(user) {
    const fields = [
        'phoneNumber', 'profilePhoto', 'aadharNumber', 'aadharPhoto',
        'panNumber', 'panPhoto', 'address', 'city', 'state', 'pincode'
    ];
    const filledFields = fields.filter(field => user[field] && user[field] !== '').length;
    return Math.round((filledFields / fields.length) * 100);
}

exports.getProfileStatus = async (req,res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: [
                'id', 'firstName', 'lastName', 'email', 'profileCompleted', 'kycVerified',
                'phoneNumber', 'address', 'city', 'state', 'pincode',
                'aadharNumber', 'panNumber', 'profilePhoto', 'aadharPhoto', 'panPhoto'
            ]
        }); 

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check and update profile completion status
        user.checkProfileCompletion();
        await user.save();

        const completionPercentage = calculateProfileCompletion(user);
        res.json({
            success: true,
            user,
            completionPercentage,
            canPostProperty: user.profileCompleted
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateKYCDetails = async (req,res) => {
   try {
    const { aadharNumber, panNumber, address, city, state, pincode, phone } = req.body;
    const userId = req.user.id;
    
    console.log('🔍 KYC Update Request Body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Address received:', address);
    console.log('🔍 City received:', city);
    console.log('🔍 State received:', state);
     
    const user = await User.findByPk(userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Aadhar number'
        });
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid PAN number'
        });
    }
    
    if (phone) user.phoneNumber = phone;
    if (aadharNumber) user.aadharNumber = aadharNumber;
    if (panNumber) user.panNumber = panNumber;
    if (address && address !== 'null' && address.trim() !== '') user.address = address;
    if (city && city !== 'null' && city.trim() !== '') user.city = city;
    if (state && state !== 'null' && state.trim() !== '') user.state = state;
    if (pincode && pincode !== 'null' && pincode.trim() !== '') user.pincode = pincode;

    // Check and update profile completion
    user.checkProfileCompletion();
    
    await user.save();
    
    console.log('✅ User saved successfully');
    console.log('🔍 User address after save:', user.address);
    console.log('🔍 User city after save:', user.city);
    console.log('🔍 User state after save:', user.state);
    console.log('🔍 Profile completed:', user.profileCompleted);

    res.status(200).json({
        success: true,
        message: 'KYC details updated successfully',
        profileCompleted: user.profileCompleted
    });

   }  catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get user profile (full details)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, phoneNumber, address, city, state, pincode } = req.body;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already in use' 
                });
            }
            user.email = email;
        }

        // Update basic fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;
        if (pincode) user.pincode = pincode;

        // Check and update profile completion
        user.checkProfileCompletion();
        
        await user.save();

        // Update localStorage user data
        const updatedUser = user.toJSON();
        delete updatedUser.password;
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Save the profile photo path
        const photoPath = `/uploads/profiles/${req.file.filename}`;
        user.profilePhoto = photoPath;
        
        await user.save();

        res.json({
            success: true,
            message: 'Profile photo uploaded successfully',
            photoPath
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};