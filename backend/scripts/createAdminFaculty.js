import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnbridge';

async function createAdminAndFaculty() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@learnbridge.com',
      password: 'admin123', // Change this!
      role: 'admin',
      isVerified: true, // Pre-verified
    };

    // Faculty credentials
    const facultyData = {
      name: 'Faculty User',
      email: 'faculty@learnbridge.com',
      password: 'faculty123', // Change this!
      role: 'faculty',
      isVerified: true, // Pre-verified
    };

    // Check if admin exists
    let admin = await User.findOne({ email: adminData.email });
    if (admin) {
      console.log('⚠️  Admin user already exists');
    } else {
      const hashedAdminPass = await bcrypt.hash(adminData.password, 10);
      admin = await User.create({
        ...adminData,
        password: hashedAdminPass,
      });
      console.log('✅ Admin user created successfully');
      console.log('   Email:', adminData.email);
      console.log('   Password:', adminData.password);
    }

    // Check if faculty exists
    let faculty = await User.findOne({ email: facultyData.email });
    if (faculty) {
      console.log('⚠️  Faculty user already exists');
    } else {
      const hashedFacultyPass = await bcrypt.hash(facultyData.password, 10);
      faculty = await User.create({
        ...facultyData,
        password: hashedFacultyPass,
      });
      console.log('✅ Faculty user created successfully');
      console.log('   Email:', facultyData.email);
      console.log('   Password:', facultyData.password);
    }

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email:', adminData.email);
    console.log('  Password:', adminData.password);
    console.log('\nFaculty:');
    console.log('  Email:', facultyData.email);
    console.log('  Password:', facultyData.password);
    console.log('─────────────────────────────────────');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdminAndFaculty();
