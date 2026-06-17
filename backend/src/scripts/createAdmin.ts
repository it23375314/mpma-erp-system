import { sequelize } from '../config/db';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { setupAssociations } from '../models/associations';

const createAdmin = async () => {
    try {
        // Setup associations
        setupAssociations();

        // Authenticate and sync
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync();

        const adminEmail = 'admin@erp.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            name: 'System Administrator',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            employeeId: 'ADM-001',
            isActive: true,
            canBookAuditorium: true,
            canBookClassroom: true,
            canBookTransport: true,
            canManageVehicles: true,
            canManageClassrooms: true,
            canManageMaintenance: true,
            phoneNumber: '0112233445'
        });

        console.log('Admin user created successfully!');
        console.log('Email: ' + adminEmail);
        console.log('Password: ' + adminPassword);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
