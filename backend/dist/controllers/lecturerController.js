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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchesByLecturer = exports.getLecturersByBatch = exports.removeLecturerFromBatch = exports.assignLecturerToBatch = exports.toggleLecturerStatus = exports.updateLecturer = exports.createLecturer = exports.getLecturerById = exports.getLecturers = void 0;
const Lecturer_1 = require("../models/Lecturer");
const Batch_1 = require("../models/Batch");
const BatchLecturer_1 = require("../models/BatchLecturer");
const Course_1 = require("../models/Course");
const getLecturers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lecturers = yield Lecturer_1.Lecturer.findAll({
            order: [['fullName', 'ASC']]
        });
        res.status(200).json(lecturers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getLecturers = getLecturers;
const getLecturerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lecturer = yield Lecturer_1.Lecturer.findByPk(req.params.id);
        if (!lecturer) {
            res.status(404).json({ message: 'Lecturer not found' });
            return;
        }
        res.status(200).json(lecturer);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getLecturerById = getLecturerById;
const createLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, nicPassport } = req.body;
        // Check unique email
        const emailExist = yield Lecturer_1.Lecturer.findOne({ where: { email } });
        if (emailExist) {
            res.status(400).json({ message: `Lecturer with email "${email}" already exists` });
            return;
        }
        // Check unique nicPassport
        const nicExist = yield Lecturer_1.Lecturer.findOne({ where: { nicPassport } });
        if (nicExist) {
            res.status(400).json({ message: `Lecturer with NIC/Passport "${nicPassport}" already exists` });
            return;
        }
        const lecturer = yield Lecturer_1.Lecturer.create(req.body);
        res.status(201).json(lecturer);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createLecturer = createLecturer;
const updateLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lecturer = yield Lecturer_1.Lecturer.findByPk(id);
        if (!lecturer) {
            res.status(404).json({ message: 'Lecturer not found' });
            return;
        }
        const { email, nicPassport } = req.body;
        if (email && email !== lecturer.email) {
            const emailExist = yield Lecturer_1.Lecturer.findOne({ where: { email } });
            if (emailExist) {
                res.status(400).json({ message: `Lecturer with email "${email}" already exists` });
                return;
            }
        }
        if (nicPassport && nicPassport !== lecturer.nicPassport) {
            const nicExist = yield Lecturer_1.Lecturer.findOne({ where: { nicPassport } });
            if (nicExist) {
                res.status(400).json({ message: `Lecturer with NIC/Passport "${nicPassport}" already exists` });
                return;
            }
        }
        yield lecturer.update(req.body);
        res.status(200).json(lecturer);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateLecturer = updateLecturer;
const toggleLecturerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const lecturer = yield Lecturer_1.Lecturer.findByPk(id);
        if (!lecturer) {
            res.status(404).json({ message: 'Lecturer not found' });
            return;
        }
        const newStatus = lecturer.status === 'Active' ? 'Inactive' : 'Active';
        yield lecturer.update({ status: newStatus });
        res.status(200).json(lecturer);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.toggleLecturerStatus = toggleLecturerStatus;
// Batch assignments logic
const assignLecturerToBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { batchId, lecturerId } = req.body;
        // Validate if batch exists
        const batch = yield Batch_1.Batch.findByPk(batchId);
        if (!batch) {
            res.status(404).json({ message: 'Batch not found' });
            return;
        }
        // Validate if lecturer exists
        const lecturer = yield Lecturer_1.Lecturer.findByPk(lecturerId);
        if (!lecturer) {
            res.status(404).json({ message: 'Lecturer not found' });
            return;
        }
        // Check if assignment already exists
        const existing = yield BatchLecturer_1.BatchLecturer.findOne({ where: { batchId, lecturerId } });
        if (existing) {
            res.status(400).json({ message: 'This lecturer is already assigned to this batch' });
            return;
        }
        const assignment = yield BatchLecturer_1.BatchLecturer.create({ batchId, lecturerId });
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.assignLecturerToBatch = assignLecturerToBatch;
const removeLecturerFromBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { batchId, lecturerId } = req.params;
        const assignment = yield BatchLecturer_1.BatchLecturer.findOne({ where: { batchId, lecturerId } });
        if (!assignment) {
            res.status(404).json({ message: 'Assignment record not found' });
            return;
        }
        yield assignment.destroy();
        res.status(200).json({ message: 'Lecturer removed from batch successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeLecturerFromBatch = removeLecturerFromBatch;
const getLecturersByBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { batchId } = req.params;
        // Find assignment records and include Lecturer model
        const assignments = yield BatchLecturer_1.BatchLecturer.findAll({
            where: { batchId },
            include: [{ model: Lecturer_1.Lecturer, as: 'lecturer' }]
        });
        // Extract lecturer data
        const lecturers = assignments.map(a => a.lecturer).filter(Boolean);
        res.status(200).json(lecturers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getLecturersByBatch = getLecturersByBatch;
const getBatchesByLecturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lecturerId } = req.params;
        // Find assignment records and include Batch and Course models
        const assignments = yield BatchLecturer_1.BatchLecturer.findAll({
            where: { lecturerId },
            include: [{
                    model: Batch_1.Batch,
                    as: 'batch',
                    include: [{ model: Course_1.Course, as: 'course' }]
                }]
        });
        // Extract batch data
        const batches = assignments.map(a => a.batch).filter(Boolean);
        res.status(200).json(batches);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getBatchesByLecturer = getBatchesByLecturer;
