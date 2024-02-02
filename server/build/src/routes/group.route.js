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
const express_1 = __importDefault(require("express"));
const validator_1 = __importDefault(require("validator"));
const functions_1 = require("../utils/functions");
const group_model_1 = __importDefault(require("../models/group.model"));
const jwt_strategy_1 = require("../utils/jwt_strategy");
const user_model_1 = __importDefault(require("../models/user.model"));
const routerGroup = express_1.default.Router();
routerGroup.post('/', createGroup);
routerGroup.get('/:id', getGroupById);
routerGroup.patch('/:id', renameGroupById);
routerGroup.delete('/:id', deleteGroupById);
routerGroup.get('/:id/users', getUsersOfGroupById);
routerGroup.put('/:id/:user_id', addUserToGroupById);
routerGroup.put('/:id/email/:email', addUserToGroupByEmail);
routerGroup.delete('/:id/:user_id', removeUserFromGroupById);
exports.default = routerGroup;
function createGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, firstUsersEmails } = req.body;
            if (!name)
                return (0, functions_1.failRequest)(res, 400, `You must provide a name for your group`);
            let payload = {
                name: validator_1.default.escape(name),
            };
            const createdGroup = yield group_model_1.default.create(payload);
            if (firstUsersEmails && firstUsersEmails.length > 0) {
                const users = yield user_model_1.default.findAll({
                    where: {
                        email: firstUsersEmails.map(email => validator_1.default.escape(email))
                    }
                });
                yield createdGroup.addUsers(users);
            }
            res.status(201).json(createdGroup);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function getGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const group = yield group_model_1.default.findByPk(id);
            if (!group)
                return (0, functions_1.failRequest)(res, 404, `Group not found`);
            res.json(group);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function renameGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const userId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(userId);
            // If the user isn't inside the group, he can't rename it
            if (!(yield currentUser.hasGroup(id)))
                return (0, functions_1.failRequest)(res, 401, 'Unauthorized');
            const { name } = req.body;
            if (!name)
                return (0, functions_1.failRequest)(res, 400, `You must provide a new name for your group`);
            const updatePayload = {
                name: validator_1.default.escape(name)
            };
            const renamedGroup = yield group_model_1.default.update(updatePayload, {
                where: { id }
            });
            res.json(renamedGroup);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function deleteGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const userId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(userId);
            // If the user isn't inside the group, he can't rename it
            if (!(yield currentUser.hasGroup(id)))
                return (0, functions_1.failRequest)(res, 401, 'Unauthorized');
            const group = yield group_model_1.default.findByPk(id);
            if (!group)
                return (0, functions_1.failRequest)(res, 404, `Group not found`);
            yield group.destroy();
            res.json({ message: 'Group deleted successfully' });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function getUsersOfGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const userId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(userId);
            // If the user isn't inside the group, he can't rename it
            if (!(yield currentUser.hasGroup(id)))
                return (0, functions_1.failRequest)(res, 401, 'Unauthorized');
            const group = yield group_model_1.default.findByPk(id);
            const usersOfGroup = yield group.getUsers({
                attributes: {
                    exclude: ['password']
                }
            });
            res.json(usersOfGroup);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function addUserToGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const userId = Number(req.params.user_id);
            if (!id || !userId)
                return (0, functions_1.failRequest)(res, 400, `You must provide a group id and a user id in the request parameters`);
            const group = yield group_model_1.default.findByPk(id);
            if (!group)
                return (0, functions_1.failRequest)(res, 404, `Group not found`);
            const user = yield user_model_1.default.findByPk(userId);
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            yield group.addUser(user);
            res.json({ message: `User n°${userId} added to group n°${id}.` });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function addUserToGroupByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const email = validator_1.default.escape(req.params.email);
            if (!id || !email || !validator_1.default.isEmail(email))
                return (0, functions_1.failRequest)(res, 400, `You must provide a group id and a user email in the request parameters`);
            const user = yield user_model_1.default.findOne({
                where: {
                    email: email
                }
            });
            const group = yield group_model_1.default.findByPk(id);
            if (!group)
                return (0, functions_1.failRequest)(res, 404, `Group not found`);
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            yield group.addUser(user);
            res.json({ message: `User n°${user.id} added to group n°${id}.` });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function removeUserFromGroupById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const userId = Number(req.params.user_id);
            if (!id || !userId)
                return (0, functions_1.failRequest)(res, 400, `You must provide a group id and a user id in the request parameters`);
            const group = yield group_model_1.default.findByPk(id);
            if (!group)
                return (0, functions_1.failRequest)(res, 404, `Group not found`);
            const user = yield user_model_1.default.findByPk(userId);
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            // If the user isn't inside the group, he can't remove someone from it
            if (!(yield user.hasGroup(id)))
                return (0, functions_1.failRequest)(res, 401, "The user provided doesn't belong to the group provided");
            yield group.removeUser(user);
            res.json({ message: `User n°${userId} removed from group n°${id}.` });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
//# sourceMappingURL=group.route.js.map