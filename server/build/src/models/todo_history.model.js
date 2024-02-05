"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const sequelize_1 = require("sequelize");
const TodoHistory = db_1.default.define('TodoHistory', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    group_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'group_',
            key: 'id',
        },
        validate: {
            isAlphanumeric: true
        }
    },
    title: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(500),
    },
    deadline: {
        type: sequelize_1.DataTypes.DATE,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(30),
        defaultValue: 'not_started',
        allowNull: false,
    },
    assignee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_',
            key: 'id',
        },
        validate: {
            isAlphanumeric: true
        }
    },
    author_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_',
            key: 'id',
        },
        validate: {
            isAlphanumeric: true
        }
    },
}, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'todo_history_'
});
exports.default = TodoHistory;
//# sourceMappingURL=todo_history.model.js.map