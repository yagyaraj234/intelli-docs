"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Routes import
const workspace = require("./workspace");
// Router initialization
const root = (0, express_1.Router)();
root.use("/workspaces", workspace);
exports.default = root;
