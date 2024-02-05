"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pg = __importStar(require("pg"));
const isSSLEnabled = process.env.DB_SSL === 'true';
const sequelize = new sequelize_1.Sequelize(process.env.DB_DATABASE || 'neat_todo', process.env.DB_USER || 'admin', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    ssl: isSSLEnabled,
    dialectOptions: {
        ssl: isSSLEnabled
    }
});
sequelize.authenticate()
    .then(() => {
    console.info('Connection to the database has been established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database :', err);
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map