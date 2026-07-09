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
const addNewAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup associations
        (0, associations_1.setupAssociations)();
        // Authenticate and sync
        yield db_1.sequelize.authenticate();
        console.log('Database connected.');
        yield db_1.sequelize.sync();
        const newAdminEmail = 'admin2@erp.com';
        const newAdminPassword = 'adminpassword123';
        const existingAdmin = yield User_1.User.findOne({ where: { email: newAdminEmail } });
        if (existingAdmin) {
            console.log(`Admin user ${newAdminEmail} already exists.`);
            process.exit(0);
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(newAdminPassword, salt);
        yield User_1.User.create({
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
    }
    catch (error) {
        console.error('Error creating new admin user:', error);
        process.exit(1);
    }
});
addNewAdmin();
