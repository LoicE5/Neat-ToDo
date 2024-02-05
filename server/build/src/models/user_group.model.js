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
const user_model_1 = __importDefault(require("./user.model"));
const group_model_1 = __importDefault(require("./group.model"));
const todo_model_1 = __importDefault(require("./todo.model"));
const UserGroup = db_1.default.define('UserGroup', {}, {
    timestamps: false,
    primaryKey: true,
    freezeTableName: true,
    tableName: 'user_group_'
});
user_model_1.default.belongsToMany(group_model_1.default, { through: UserGroup, onDelete: 'cascade', foreignKey: 'user_id' });
group_model_1.default.belongsToMany(user_model_1.default, { through: UserGroup, onDelete: 'cascade', foreignKey: 'group_id' });
group_model_1.default.beforeDestroy((instance, options) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = instance.get().id;
    // Manually delete Todos associated with the group
    yield todo_model_1.default.destroy({
        where: {
            group_id: groupId,
        },
        transaction: options.transaction
    });
    yield UserGroup.destroy({
        where: {
            group_id: groupId
        },
        transaction: options.transaction
    });
}));
UserGroup.afterDestroy((instance, options) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = instance.get().group_id;
    yield todo_model_1.default.update({ group_id: null }, {
        where: {
            group_id: groupId,
        },
        transaction: options.transaction,
    });
}));
exports.default = UserGroup;
//# sourceMappingURL=user_group.model.js.map