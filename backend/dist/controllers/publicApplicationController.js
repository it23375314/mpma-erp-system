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
exports.submitPublicApplication = exports.searchSlpaEmployee = void 0;
const sequelize_1 = require("sequelize");
const SlpaEmployee_1 = __importDefault(require("../models/SlpaEmployee"));
const studentApplicationService_1 = require("../services/studentApplicationService");
const searchSlpaEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = String(req.query.query || '').trim();
    if (!query || query.length > 50)
        return res.status(400).json({ success: false, message: 'Enter a valid service number, EPF number or NIC.' });
    const employee = yield SlpaEmployee_1.default.findOne({ where: { active: true, [sequelize_1.Op.or]: [{ serviceNumber: query }, { epfNumber: query }, { nic: query }] }, attributes: { exclude: ['active', 'createdAt', 'updatedAt'] } });
    if (!employee)
        return res.status(404).json({ success: false, message: 'No active SLPA employee was found.' });
    return res.json({ success: true, employee });
});
exports.searchSlpaEmployee = searchSlpaEmployee;
const submitPublicApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, studentApplicationService_1.createStudentApplication)(req.body, req.files || [], 'STUDENT_SELF');
        return res.status(201).json(Object.assign(Object.assign({ success: true, message: 'Application submitted successfully' }, result), { status: 'PENDING_REVIEW' }));
    }
    catch (error) {
        if (error instanceof studentApplicationService_1.ApplicationValidationError)
            return res.status(400).json({ success: false, message: error.message, fields: error.fields });
        console.error('Application submission failed:', error);
        return res.status(500).json({ success: false, message: 'Unable to submit the application.' });
    }
});
exports.submitPublicApplication = submitPublicApplication;
