const db = require('./models');

async function checkUsers() {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'name', 'email', 'profileCompleted']
        });
        
        console.log('Users in database:');
        users.forEach(user => {
            console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Profile Completed: ${user.profileCompleted}`);
        });
        
        if (users.length === 0) {
            console.log('No users found. You need to register first.');
        } else {
            console.log(`\nFound ${users.length} user(s). You can login with any of these emails.`);
        }
        
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        process.exit();
    }
}

checkUsers();
