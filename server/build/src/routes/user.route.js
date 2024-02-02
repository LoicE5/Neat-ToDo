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
const user_model_1 = __importDefault(require("../models/user.model"));
const user_group_model_1 = __importDefault(require("../models/user_group.model"));
const validator_1 = __importDefault(require("validator"));
const group_model_1 = __importDefault(require("../models/group.model"));
const functions_1 = require("../utils/functions");
const db_1 = __importDefault(require("../../db"));
const routerUser = express_1.default.Router();
routerUser.get('/:id', getUserById);
routerUser.get('/:id/groups', getUserGroupsById);
routerUser.put('/:id', updateUserById);
routerUser.delete('/:id', deleteUserById);
exports.default = routerUser;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            if (!(0, functions_1.isUserIdFromTokenMatchingRequest)(req.headers.authorization, id))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const user = yield user_model_1.default.findByPk(id, { attributes: { exclude: ['password'] } });
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            res.json(user);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function getUserGroupsById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(validator_1.default.escape(req.params.id));
            if (!(0, functions_1.isUserIdFromTokenMatchingRequest)(req.headers.authorization, id))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const user = yield user_model_1.default.findByPk(id, {
                include: [{
                        model: group_model_1.default,
                        through: user_group_model_1.default,
                        attributes: [
                            'id',
                            'name',
                            [
                                db_1.default.literal(`(SELECT COUNT(*) FROM user_group_ WHERE user_group_.group_id = "Groups"."id")`),
                                'userCount'
                            ]
                        ],
                        include: [{
                                model: user_model_1.default,
                                attributes: ['id', 'nickname', 'email'],
                                through: { attributes: [] } // Exclude the UserGroup association attributes
                            }]
                    }],
            });
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            res.json(user.Groups);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function updateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            // If the user tries to access another user's profile (token's id doesn't match params id)
            if (!(0, functions_1.isUserIdFromTokenMatchingRequest)(req.headers.authorization, id))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const { nickname, email, password } = req.body;
            let updatePayload = {};
            if (nickname)
                updatePayload.nickname = validator_1.default.escape(nickname);
            // If an email is provided, we check if it is well formed and push it, otherwise we warn
            if (email) {
                if (validator_1.default.isEmail(email))
                    updatePayload.email = validator_1.default.escape(email);
                else
                    return (0, functions_1.failRequest)(res, 400, `Your email address doesn't have the right format`);
            }
            if (password)
                updatePayload.password = yield (0, functions_1.hashPassword)(password);
            // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
            if ((0, functions_1.isObjectEmpty)(updatePayload))
                return (0, functions_1.failRequest)(res, 400, `Your request doesn't have the adequate parameters`);
            const updatedUser = yield user_model_1.default.update(updatePayload, {
                where: { id }
            });
            res.json(updatedUser);
        }
        catch (error) {
            console.error(error);
            if (error.name == 'SequelizeUniqueConstraintError')
                (0, functions_1.failRequest)(res, 409, `This nickname and/or email address is already taken`);
            else
                (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function deleteUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            // If the user tries to access another user's profile (token's id doesn't match params id)
            if (!(0, functions_1.isUserIdFromTokenMatchingRequest)(req.headers.authorization, id))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const user = yield user_model_1.default.findByPk(id);
            if (!user)
                return (0, functions_1.failRequest)(res, 404, `User not found`);
            yield user.destroy();
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
//# sourceMappingURL=user.route.js.map