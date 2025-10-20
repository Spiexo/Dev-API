"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.query = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, "dev-api.db");
const dbPromise = (0, sqlite_1.open)({
    filename: dbPath,
    driver: sqlite3_1.default.Database,
});
const query = async (sql, params = []) => {
    const db = await dbPromise;
    return db.all(sql, params);
};
exports.query = query;
const run = async (sql, params = []) => {
    const db = await dbPromise;
    return db.run(sql, params);
};
exports.run = run;
exports.default = dbPromise;
