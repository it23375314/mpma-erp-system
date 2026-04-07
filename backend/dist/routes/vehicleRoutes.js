"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleController_1 = require("../controllers/vehicleController");
const router = express_1.default.Router();
router.route('/').get(vehicleController_1.getVehicles).post(vehicleController_1.createVehicle);
router.route('/:id').delete(vehicleController_1.deleteVehicle).put(vehicleController_1.updateVehicle);
exports.default = router;
