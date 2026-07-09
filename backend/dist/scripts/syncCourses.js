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
const db_1 = require("../config/db");
const Course_1 = require("../models/Course");
const Batch_1 = require("../models/Batch");
const Lecturer_1 = require("../models/Lecturer");
const BatchLecturer_1 = require("../models/BatchLecturer");
const associations_1 = require("../models/associations");
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup model relationships
        (0, associations_1.setupAssociations)();
        // Authenticate database connection
        yield db_1.sequelize.authenticate();
        console.log('Database connected.');
        // Synchronize models
        console.log('Syncing Course, Batch, Lecturer, and BatchLecturer models...');
        yield Course_1.Course.sync({ alter: true });
        yield Batch_1.Batch.sync({ alter: true });
        yield Lecturer_1.Lecturer.sync({ alter: true });
        yield BatchLecturer_1.BatchLecturer.sync({ alter: true });
        console.log('Database synchronization completed successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1);
    }
});
syncDatabase();
