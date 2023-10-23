"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const config_1 = __importDefault(require("./config"));
const pool = mysql2_1.default.createPool(config_1.default);
exports.db = pool.promise();
