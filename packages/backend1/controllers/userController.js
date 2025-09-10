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