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
exports.updateVehicle = exports.deleteVehicle = exports.createVehicle = exports.getVehicles = void 0;
const Vehicle_1 = require("../models/Vehicle");
const getVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield Vehicle_1.Vehicle.findAll();
        res.status(200).json(vehicles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getVehicles = getVehicles;
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield Vehicle_1.Vehicle.create(req.body);
        res.status(201).json(vehicle);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createVehicle = createVehicle;
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield Vehicle_1.Vehicle.findByPk(req.params.id);
        if (!vehicle)
            return res.status(404).json({ message: 'Vehicle not found' });
        yield vehicle.destroy();
        res.status(200).json({ message: 'Vehicle removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteVehicle = deleteVehicle;
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield Vehicle_1.Vehicle.findByPk(req.params.id);
        if (!vehicle)
            return res.status(404).json({ message: 'Vehicle not found' });
        yield vehicle.update(req.body);
        res.status(200).json(vehicle);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateVehicle = updateVehicle;
