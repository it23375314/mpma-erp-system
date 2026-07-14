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
exports.toggleCourseStatus = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const Course_1 = require("../models/Course");
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.Course.findAll({
            order: [['courseName', 'ASC']]
        });
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCourses = getCourses;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.Course.findByPk(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json(course);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCourseById = getCourseById;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseCode } = req.body;
        // Check if course code is already registered
        const existing = yield Course_1.Course.findOne({ where: { courseCode } });
        if (existing) {
            res.status(400).json({ message: `Course code "${courseCode}" already exists` });
            return;
        }
        const course = yield Course_1.Course.create(req.body);
        res.status(201).json(course);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield Course_1.Course.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const { courseCode } = req.body;
        if (courseCode && courseCode !== course.courseCode) {
            const existing = yield Course_1.Course.findOne({ where: { courseCode } });
            if (existing) {
                res.status(400).json({ message: `Course code "${courseCode}" is already in use by another course` });
                return;
            }
        }
        yield course.update(req.body);
        res.status(200).json(course);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateCourse = updateCourse;
const toggleCourseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield Course_1.Course.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const newStatus = course.status === 'Active' ? 'Inactive' : 'Active';
        yield course.update({ status: newStatus });
        res.status(200).json(course);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.toggleCourseStatus = toggleCourseStatus;
