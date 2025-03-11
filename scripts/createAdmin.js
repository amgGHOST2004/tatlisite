require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAdmin() {
    try {
        const admin = new Admin({
            username: 'admin',
            password: 'securepassword'
        });
        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
}

createAdmin();