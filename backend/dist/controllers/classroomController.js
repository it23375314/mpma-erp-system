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
exports.updateClassroom = exports.deleteClassroom = exports.createClassroom = exports.getClassrooms = void 0;
const Classroom_1 = require("../models/Classroom");
const getClassrooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classrooms = yield Classroom_1.Classroom.findAll();
        res.status(200).json(classrooms);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getClassrooms = getClassrooms;
const createClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield Classroom_1.Classroom.create(req.body);
        res.status(201).json(classroom);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createClassroom = createClassroom;
const deleteClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield Classroom_1.Classroom.findByPk(req.params.id);
        if (!classroom)
            return res.status(404).json({ message: 'Classroom not found' });
        yield classroom.destroy();
        res.status(200).json({ message: 'Classroom deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteClassroom = deleteClassroom;
const updateClassroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroom = yield Classroom_1.Classroom.findByPk(req.params.id);
        if (!classroom)
            return res.status(404).json({ message: 'Classroom not found' });
        yield classroom.update(req.body);
        res.status(200).json(classroom);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateClassroom = updateClassroom;
