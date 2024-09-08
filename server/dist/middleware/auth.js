"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../utils/response/error");
// Middleware to check if the user is logged in
const auth = (req, res, next) => {
    var _a;
    try {
        const token = req.cookies["intelli-doc-token"] ||
            ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            return res
                .status(401)
                .json((0, error_1.ApiError)("You are not authorized to access this route", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json((0, error_1.ApiError)("You are not authorized to access this route", 401));
        }
        req.user = decoded;
        // @ts-ignore
        req.body.uid = decoded.uid;
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json((0, error_1.ApiError)("You are not authorized to access this route", 401));
    }
};
exports.auth = auth;
