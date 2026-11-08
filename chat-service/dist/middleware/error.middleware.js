"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrorHandler = void 0;
const api_error_1 = require("../types/api.error");
const apiErrorHandler = (err, req, res, next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.statusCode).json({
            status: err.name || 'error',
            message: err.message
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error, see server logs in console"
    });
    return;
};
exports.apiErrorHandler = apiErrorHandler;
