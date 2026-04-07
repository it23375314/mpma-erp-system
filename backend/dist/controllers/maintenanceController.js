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
exports.updateMaintenance = exports.deleteMaintenance = exports.createMaintenance = exports.checkMaintenanceConflict = exports.getMaintenances = void 0;
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
const Classroom_1 = require("../models/Classroom");
const Vehicle_1 = require("../models/Vehicle");
const sequelize_1 = require("sequelize");
// @desc    Get all maintenances
// @route   GET /api/maintenances
// @access  Public
const getMaintenances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { facilityType, date } = req.query;
        const whereClause = {};
        if (facilityType) {
            whereClause.facilityType = facilityType;
        }
        // Optional date filter: find maintenances that overlap with specific date
        if (date) {
            whereClause.dateFrom = { [sequelize_1.Op.lte]: date };
            whereClause.dateTo = { [sequelize_1.Op.gte]: date };
        }
        const maintenances = yield Maintenance_1.default.findAll({
            where: whereClause,
            include: [
                { model: Classroom_1.Classroom, as: 'classroom' },
                { model: Vehicle_1.Vehicle, as: 'vehicle' }
            ],
            order: [['dateFrom', 'DESC']],
        });
        res.json(maintenances);
    }
    catch (error) {
        console.error('Error fetching maintenances:', error);
        res.status(500).json({ message: 'Server error fetching maintenances' });
    }
});
exports.getMaintenances = getMaintenances;
// @desc    Get conflicting maintenances for a specific facility
// @route   POST /api/maintenances/check-conflict
// @access  Public
const checkMaintenanceConflict = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;
        const whereClause = {
            // Check if it's for this specific facility, OR it's a general facility maintenance
            [sequelize_1.Op.or]: [
                { facilityType: 'General' },
                Object.assign({ facilityType }, (facilityId ? {
                    [sequelize_1.Op.or]: [{ facilityId }, { facilityId: null }]
                } : {}))
            ],
            // Overlapping date math: startA <= endB AND endA >= startB
            dateFrom: { [sequelize_1.Op.lte]: dateTo },
            dateTo: { [sequelize_1.Op.gte]: dateFrom },
        };
        // If dates are exactly the same, also check time overlap
        // Note: this is a simplification. A more robust check might need raw SQL for exact timestamp overlaps
        // But for daily bookings, this date-level overlap is usually sufficient.
        const conflicts = yield Maintenance_1.default.findAll({
            where: whereClause,
            include: [
                { model: Classroom_1.Classroom, as: 'classroom' },
                { model: Vehicle_1.Vehicle, as: 'vehicle' }
            ]
        });
        res.json({
            hasConflict: conflicts.length > 0,
            conflicts
        });
    }
    catch (error) {
        console.error('Error checking maintenance conflicts:', error);
        res.status(500).json({ message: 'Server error checking conflicts' });
    }
});
exports.checkMaintenanceConflict = checkMaintenanceConflict;
// @desc    Create a new maintenance record
// @route   POST /api/maintenances
// @access  Admin
const createMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;
        const maintenance = yield Maintenance_1.default.create({
            title,
            description,
            facilityType,
            facilityId: facilityId || null,
            dateFrom,
            dateTo,
            timeFrom,
            timeTo,
        });
        res.status(201).json(maintenance);
    }
    catch (error) {
        console.error('Error creating maintenance:', error);
        res.status(500).json({ message: 'Error creating maintenance record' });
    }
});
exports.createMaintenance = createMaintenance;
// @desc    Delete a maintenance record
// @route   DELETE /api/maintenances/:id
// @access  Admin
const deleteMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maintenance = yield Maintenance_1.default.findByPk(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }
        yield maintenance.destroy();
        res.json({ message: 'Maintenance removed successfully' });
    }
    catch (error) {
        console.error('Error deleting maintenance:', error);
        res.status(500).json({ message: 'Error deleting maintenance record' });
    }
});
exports.deleteMaintenance = deleteMaintenance;
// @desc    Update a maintenance record
// @route   PUT /api/maintenances/:id
// @access  Admin
const updateMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maintenance = yield Maintenance_1.default.findByPk(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }
        const { title, description, facilityType, facilityId, dateFrom, dateTo, timeFrom, timeTo } = req.body;
        yield maintenance.update({
            title,
            description,
            facilityType,
            facilityId: facilityId || null,
            dateFrom,
            dateTo,
            timeFrom,
            timeTo,
        });
        res.json(maintenance);
    }
    catch (error) {
        console.error('Error updating maintenance:', error);
        res.status(500).json({ message: 'Error updating maintenance record' });
    }
});
exports.updateMaintenance = updateMaintenance;
