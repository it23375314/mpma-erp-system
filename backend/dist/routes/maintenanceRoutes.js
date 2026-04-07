"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const router = (0, express_1.Router)();
router.route('/')
    .get(maintenanceController_1.getMaintenances)
    .post(maintenanceController_1.createMaintenance);
router.post('/check-conflict', maintenanceController_1.checkMaintenanceConflict);
router.route('/:id')
    .delete(maintenanceController_1.deleteMaintenance)
    .put(maintenanceController_1.updateMaintenance);
exports.default = router;
