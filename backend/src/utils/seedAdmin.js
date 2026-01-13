/**
 * Admin Seed Script
 * Creates initial admin user if not exists
 * 
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../models');
const config = require('../config');

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: config.admin.email });

        if (existingAdmin) {
            console.log('⚠️ Admin already exists:', config.admin.email);
            process.exit(0);
        }

        // Create admin
        const admin = await Admin.create({
            email: config.admin.email,
            password: config.admin.password,
            name: 'Admin',
            role: 'super_admin',
        });

        console.log('✅ Admin created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔐 Password:', config.admin.password);
        console.log('\n⚠️ Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
