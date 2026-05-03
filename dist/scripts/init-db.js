"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../src/database");
const logger_1 = __importDefault(require("../src/logger"));
async function init() {
    try {
        logger_1.default.info('Trying to initialize database...');
        const sqlPath = path_1.default.join(__dirname, '../resources/sql/schema.sql');
        const sql = fs_1.default.readFileSync(sqlPath, 'utf8');
        await database_1.db.query(sql);
        logger_1.default.info('Completely initialized!');
    }
    catch (err) {
        logger_1.default.error('An error raised trying to initialize database:', err);
    }
    finally {
        await database_1.db.pool.end();
        process.exit();
    }
}
init();
