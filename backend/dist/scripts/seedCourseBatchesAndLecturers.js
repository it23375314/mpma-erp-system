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
require("../config/env");
const db_1 = require("../config/db");
const Course_1 = require("../models/Course");
const Batch_1 = require("../models/Batch");
const Lecturer_1 = require("../models/Lecturer");
const BatchLecturer_1 = require("../models/BatchLecturer");
const courseCodes = ['MAR-SEA', 'OHS', 'PORT-LOG', 'TECH', 'MGT-IS'];
const lecturerNames = [
    'Capt. Nimal Perera',
    'Dr. Anushka Fernando',
    'Mr. Dinesh Silva',
    'Ms. Kavindi Jayasinghe',
    'Eng. Ruwan Wijesekara',
];
const toDate = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const seedCourseData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.sequelize.authenticate();
        yield db_1.sequelize.sync();
        let batchesCreated = 0;
        let lecturersCreated = 0;
        let assignmentsCreated = 0;
        for (let courseIndex = 0; courseIndex < courseCodes.length; courseIndex += 1) {
            const courseCode = courseCodes[courseIndex];
            const course = yield Course_1.Course.findOne({ where: { courseCode } });
            if (!course) {
                throw new Error(`Course ${courseCode} was not found. Run npm run seed:courses first.`);
            }
            const lecturers = [];
            for (let lecturerIndex = 0; lecturerIndex < 5; lecturerIndex += 1) {
                const sequence = courseIndex * 5 + lecturerIndex + 1;
                const name = lecturerNames[lecturerIndex];
                const email = `${courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}.lecturer${lecturerIndex + 1}@mpma.demo`;
                const nicPassport = `MPMA-DEMO-${String(sequence).padStart(3, '0')}`;
                const [lecturer, wasCreated] = yield Lecturer_1.Lecturer.findOrCreate({
                    where: { email },
                    defaults: {
                        fullName: `${name} (${courseCode})`,
                        nicPassport,
                        dateOfBirth: toDate(1975 + lecturerIndex * 3, lecturerIndex + 1, 10 + lecturerIndex),
                        gender: lecturerIndex === 1 || lecturerIndex === 3 ? 'Female' : 'Male',
                        mobile: `077${String(1000000 + sequence).padStart(7, '0')}`,
                        email,
                        address: `${20 + sequence}, Maritime Avenue, Colombo 15`,
                        emergencyContact: `071${String(2000000 + sequence).padStart(7, '0')}`,
                        bankName: 'Bank of Ceylon',
                        branchName: 'Colombo Fort',
                        accountHolderName: `${name} (${courseCode})`,
                        accountNumber: `70${String(100000 + sequence).padStart(6, '0')}`,
                        status: 'Active',
                    },
                });
                if (wasCreated)
                    lecturersCreated += 1;
                lecturers.push(lecturer);
            }
            for (let batchIndex = 0; batchIndex < 5; batchIndex += 1) {
                const batchNumber = batchIndex + 1;
                const startMonth = 1 + batchIndex * 2;
                const endMonth = Math.min(startMonth + 5, 12);
                const batchCode = `${courseCode}-2026-${String(batchNumber).padStart(2, '0')}`;
                const [batch, wasCreated] = yield Batch_1.Batch.findOrCreate({
                    where: { batchCode },
                    defaults: {
                        batchCode,
                        courseId: course.id,
                        startDate: toDate(2026, startMonth, 1),
                        endDate: toDate(2026, endMonth, 28),
                        location: `MPMA Training Room ${courseIndex + 1}`,
                        maxStudents: 40,
                        currentStudents: 10 + batchIndex * 3,
                        status: 'Available',
                    },
                });
                if (wasCreated)
                    batchesCreated += 1;
                for (const lecturer of lecturers) {
                    const [, assignmentCreated] = yield BatchLecturer_1.BatchLecturer.findOrCreate({
                        where: { batchId: batch.id, lecturerId: lecturer.id },
                        defaults: { batchId: batch.id, lecturerId: lecturer.id },
                    });
                    if (assignmentCreated)
                        assignmentsCreated += 1;
                }
            }
        }
        console.log(`Course demo data synchronized: ${batchesCreated} batches, ${lecturersCreated} lecturers, and ${assignmentsCreated} assignments created.`);
    }
    catch (error) {
        console.error('Unable to synchronize course demo data:', error);
        process.exitCode = 1;
    }
    finally {
        yield db_1.sequelize.close();
    }
});
seedCourseData();
