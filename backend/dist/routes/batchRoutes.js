"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batchController_1 = require("../controllers/batchController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .get(batchController_1.getBatches)
    .post(batchController_1.createBatch);
router.route('/:id')
    .get(batchController_1.getBatchById)
    .put(batchController_1.updateBatch);
router.route('/:id/enroll')
    .post(batchController_1.enrollStudent);
exports.default = router;
