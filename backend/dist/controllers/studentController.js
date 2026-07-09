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
exports.deleteStudent = exports.getStudents = exports.enrollStudent = void 0;
const Student_1 = __importDefault(require("../models/Student"));
const enrollStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, dob, gender, address, course, batch } = req.body;
        // Check if email already exists
        const existingStudent = yield Student_1.default.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ message: 'A student with this email already exists.' });
        }
        const student = yield Student_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            address,
            course,
            batch,
            status: 'Enrolled' // Default to Enrolled for now
        });
        res.status(201).json({
            message: 'Student enrolled successfully',
            student
        });
    }
    catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.enrollStudent = enrollStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield Student_1.default.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.getStudents = getStudents;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const student = yield Student_1.default.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        yield student.destroy();
        res.json({ message: 'Student deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});
exports.deleteStudent = deleteStudent;
