"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSuccess = void 0;
const ApiSuccess = (message, data) => {
    return {
        status: "success",
        message,
        data,
        code: 200,
    };
};
exports.ApiSuccess = ApiSuccess;
