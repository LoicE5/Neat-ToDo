"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const sequelize_1 = require("sequelize");
const User = db_1.default.define('User', {
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    nickname: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            isAlphanumeric: true
        }
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'user_',
    uniqueKeys: {
        user_unique: {
            fields: ['email', 'nickname'],
        },
    },
});
exports.default = User;
//# sourceMappingURL=user.model.js.map