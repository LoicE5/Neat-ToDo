"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const sequelize_1 = require("sequelize");
const todo_history_model_1 = __importDefault(require("./todo_history.model"));
const user_model_1 = __importDefault(require("./user.model"));
const group_model_1 = __importDefault(require("./group.model"));
const Todo = db_1.default.define('Todo', {
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
    tableName: 'todo_',
    freezeTableName: true
});
Todo.belongsTo(user_model_1.default, { as: 'author', foreignKey: 'author_id' });
Todo.belongsTo(user_model_1.default, { as: 'assignee', foreignKey: 'assignee_id' });
Todo.belongsTo(group_model_1.default, { as: 'group', foreignKey: 'group_id' });
Todo.afterDestroy((instance, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_history_model_1.default.create(instance.get(), { transaction: options.transaction });
}));
exports.default = Todo;
//# sourceMappingURL=todo.model.js.map