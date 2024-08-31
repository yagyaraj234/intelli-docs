"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path = require("path");
const multer_1 = __importDefault(require("multer"));
// Configure Multer
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = [".pdf", ".jpg", ".jpeg", ".png", ".gif"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only PDF, JPG, JPEG, PNG, and GIF are allowed."));
        }
    },
});
