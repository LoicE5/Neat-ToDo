"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const sequelize_1 = require("sequelize");
const Group = db_1.default.define('Group', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'group_'
});
exports.default = Group;
//# sourceMappingURL=group.model.js.map