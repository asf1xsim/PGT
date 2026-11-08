"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
exports.validateBody = validateBody;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const api_error_1 = require("../types/api.error");
async function validateData(data, type) {
    const instance = (0, class_transformer_1.plainToInstance)(type, data);
    const errors = await (0, class_validator_1.validate)(instance);
    if (errors.length > 0) {
        const errorMessage = errors
            .map((error) => Object.values(error.constraints))
            .flat()
            .join(", ");
        throw new api_error_1.ApiError('bad input', errorMessage, 400);
    }
    return instance;
}
async function validateParams(req, type) {
    return await validateData(req.params, type);
}
async function validateQuery(req, type) {
    return await validateData(req.query, type);
}
async function validateBody(req, type) {
    return await validateData(req.body, type);
}
