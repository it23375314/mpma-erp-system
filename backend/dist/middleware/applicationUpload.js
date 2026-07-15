"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png']);
exports.applicationUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 10 },
    fileFilter: (_req, file, cb) => allowed.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only PDF, JPG, JPEG and PNG documents are allowed.')),
}).array('documents', 10);
