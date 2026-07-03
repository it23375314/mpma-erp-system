"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const associations_1 = require("../models/associations");
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup associations
        (0, associations_1.setupAssociations)();
        // Authenticate and sync
        yield db_1.sequelize.authenticate();
        console.log('Database connected.');
        yield db_1.sequelize.sync();
        const adminEmail = 'admin@erp.com';
        const adminPassword = 'admin123';
        const existingAdmin = yield User_1.User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, salt);
        yield User_1.User.create({
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
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
});
createAdmin();
