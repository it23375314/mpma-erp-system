import { sequelize } from '../config/db';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { setupAssociations } from '../models/associations';

const addNewAdmin = async () => {
    try {
        // Setup associations
        setupAssociations();

        // Authenticate and sync
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync();

        const newAdminEmail = 'admin2@erp.com';
        const newAdminPassword = 'adminpassword123';

        const existingAdmin = await User.findOne({ where: { email: newAdminEmail } });
        if (existingAdmin) {
            console.log(`Admin user ${newAdminEmail} already exists.`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newAdminPassword, salt);

        await User.create({
            name: 'New Administrator',
            email: newAdminEmail,
            password: hashedPassword,
            role: 'admin',
            employeeId: 'ADM-002',
            isActive: true,
            canBookAuditorium: true,
            canBookClassroom: true,
            canBookTransport: true,
            canManageVehicles: true,
            canManageClassrooms: true,
            canManageMaintenance: true,
            phoneNumber: '0771234567'
        });

        console.log('--------------------------------------------------');
        console.log('NEW ADMINISTRATOR CREATED SUCCESSFULLY!');
        console.log('--------------------------------------------------');
        console.log('Email:    ' + newAdminEmail);
        console.log('Password: ' + newAdminPassword);
        console.log('Role:      admin');
        console.log('--------------------------------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error creating new admin user:', error);
        process.exit(1);
    }
};

addNewAdmin();
