"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Routes import
const auth_1 = __importDefault(require("./auth"));
// Router initialization
const root = (0, express_1.Router)();
root.use("/auth", auth_1.default);
exports.default = root;
