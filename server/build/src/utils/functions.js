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
exports.isValidTodoStatus = exports.isUserRelatedToTodo = exports.isObjectEmpty = exports.isUserIdFromTokenMatchingRequest = exports.decodeJwtToken = exports.hashPassword = exports.failRequest = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_strategy_1 = require("./jwt_strategy");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enums_1 = require("./enums");
/**
 * Creates a standardized response, with the response code in params and a custom message forwarded via json
 * @param res
 * @param status
 * @param message
 */
function failRequest(res, status, message) {
    res.status(status).json({ message: message });
}
exports.failRequest = failRequest;
/**
 * Returns a salted hashed version of the given password
 * @param password
 * @returns {string}
 */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return yield bcryptjs_1.default.hash(password, salt);
    });
}
exports.hashPassword = hashPassword;
/**
 * Decode a JWT token as an object containing the user id, needed to check which resource a user can access
 * @param authHeader often req.headers.authorization
 * @param secret The secret used to encode the token
 * @returns {userDecodedJwtToken}
 */
function decodeJwtToken(authHeader, secret = jwt_strategy_1.secret) {
    const reqToken = authHeader.slice(7); // Remove the "Bearer " string before the actual token
    const decodedToken = jsonwebtoken_1.default.verify(reqToken, secret);
    return decodedToken;
}
exports.decodeJwtToken = decodeJwtToken;
/**
 * Checks if the user's id of the JWT token matches the provided user's id
 * @param authHeader often req.headers.authorization
 * @param id often found in the params : req.params.id
 * @returns {boolean}
 */
function isUserIdFromTokenMatchingRequest(authHeader, id) {
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return false;
    const reqUserId = decodeJwtToken(authHeader).id;
    if (id !== reqUserId)
        return false;
    return true;
}
exports.isUserIdFromTokenMatchingRequest = isUserIdFromTokenMatchingRequest;
/**
 * Checks if an object have no keys at all
 * @param obj
 * @returns {boolean}
 */
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
exports.isObjectEmpty = isObjectEmpty;
/**
 * Checks if a user is a todo's assignee, a todo's author or member of the group the todo is in
 * @param user A User's model instance
 * @param todo A Todo model instance
 * @param userId Optional, the userId of the user if already given
 * @returns {boolean}
 */
function isUserRelatedToTodo(user, todo, userId = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId)
            userId = user.id;
        return (userId === todo.assignee_id ||
            userId === todo.author_id ||
            (yield user.hasGroup(todo.group_id)));
    });
}
exports.isUserRelatedToTodo = isUserRelatedToTodo;
/**
 * Checks if the string provided is a valid Todo status as stated in the TodoStatus enum
 * @param status The status we want to check
 * @returns {boolean}
 */
function isValidTodoStatus(status) {
    return Object.values(enums_1.TodoStatus).includes(status);
}
exports.isValidTodoStatus = isValidTodoStatus;
//# sourceMappingURL=functions.js.map