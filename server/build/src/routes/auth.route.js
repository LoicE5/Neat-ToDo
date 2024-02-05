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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_strategy_1 = require("../utils/jwt_strategy");
const functions_1 = require("../utils/functions");
const validator_1 = __importDefault(require("validator"));
const routerAuth = express_1.default.Router();
routerAuth.post('/login', login);
routerAuth.post('/signup', signup);
exports.default = routerAuth;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const defaultFail = () => (0, functions_1.failRequest)(res, 401, `Incorrect email or password`);
        if (!email || !password)
            return defaultFail();
        if (!validator_1.default.isEmail(email))
            return defaultFail();
        try {
            const user = yield user_model_1.default.findOne({ where: { email: email } });
            if (!user)
                return defaultFail();
            if (yield bcryptjs_1.default.compare(password, user.password)) {
                const payload = { id: user.id };
                const token = jsonwebtoken_1.default.sign(payload, jwt_strategy_1.secret);
                delete user.dataValues.password;
                return res.json({ message: 'ok', token: token, user: user });
            }
            return defaultFail();
        }
        catch (error) {
            console.error(error);
            defaultFail();
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultFail = () => (0, functions_1.failRequest)(res, 500, `There have been an error processing your signup.`);
        const { nickname, email, password } = req.body;
        if (!nickname || !email || !password)
            return defaultFail();
        if (!validator_1.default.isEmail(email))
            return defaultFail();
        const payload = {
            nickname: nickname,
            email: email,
            password: yield (0, functions_1.hashPassword)(password)
        };
        try {
            const newUser = yield user_model_1.default.create(payload);
            res.status(201).json(newUser);
        }
        catch (error) {
            console.error(error);
            if (error.name == 'SequelizeUniqueConstraintError')
                (0, functions_1.failRequest)(res, 409, `This email or nickname already exists.`);
            else
                defaultFail();
        }
    });
}
//# sourceMappingURL=auth.route.js.map