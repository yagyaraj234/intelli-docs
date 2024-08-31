"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const ApiError = (message, code, details) => {
    return {
        status: "error",
        message,
        code,
        details,
    };
};
exports.ApiError = ApiError;
