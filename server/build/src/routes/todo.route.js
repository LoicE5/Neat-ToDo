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
const jwt_strategy_1 = require("../utils/jwt_strategy");
const functions_1 = require("../utils/functions");
const validator_1 = __importDefault(require("validator"));
const todo_model_1 = __importDefault(require("../models/todo.model"));
const group_model_1 = __importDefault(require("../models/group.model"));
const routerToDo = express_1.default.Router();
routerToDo.post('/', createATodo);
routerToDo.get('/:id', getTodoById);
routerToDo.put('/:id', updateTodoById);
routerToDo.get('/author/:user_id', getAllTodoOfAuthor);
routerToDo.get('/assignee/:user_id', getAllTodoOfAssignee);
routerToDo.delete('/:id', deleteTodoById);
routerToDo.get('/group/:group_id', getAllTodoOfGroup);
exports.default = routerToDo;
function createATodo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { group_id, title, description, deadline, status, assignee_id, author_id } = req.body;
            if (!title || !assignee_id || !author_id)
                return (0, functions_1.failRequest)(res, 400, `Required parameters haven't been set`);
            const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            if (currentUserId !== author_id)
                (0, functions_1.failRequest)(res, 400, `You cannot assign a todo on behalf of others`);
            let createPayload = {
                title: validator_1.default.escape(title),
                assignee_id: Number(assignee_id),
                author_id: Number(author_id)
            };
            if (group_id)
                createPayload.group_id = Number(group_id);
            if (description)
                createPayload.description = validator_1.default.escape(description);
            if (deadline) {
                if (validator_1.default.isDate(deadline))
                    createPayload.deadline = new Date(deadline);
                else
                    return (0, functions_1.failRequest)(res, 400, `Your date format is not valid`);
            }
            if (status) {
                if ((0, functions_1.isValidTodoStatus)(status))
                    createPayload.status = validator_1.default.escape(status);
                else
                    return (0, functions_1.failRequest)(res, 400, `Your todo's status is not valid`);
            }
            const newTodo = yield todo_model_1.default.create(createPayload);
            res.status(201).json(newTodo);
        }
        catch (error) {
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function getTodoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const toDo = yield todo_model_1.default.findByPk(id);
            if (!toDo)
                return (0, functions_1.failRequest)(res, 404, `ToDo not found`);
            const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(currentUserId);
            if (!(yield (0, functions_1.isUserRelatedToTodo)(currentUser, toDo, currentUserId)))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            res.json(toDo);
        }
        catch (err) {
            console.error(err);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function updateTodoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(currentUserId);
            const toBeUpdatedTodo = yield todo_model_1.default.findByPk(id);
            if (!toBeUpdatedTodo)
                return (0, functions_1.failRequest)(res, 404, `Todo not found`);
            // A user can't update a todo he's not related to
            if (!(yield (0, functions_1.isUserRelatedToTodo)(currentUser, toBeUpdatedTodo, currentUserId)))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const { title, description, deadline, status, assignee_id, group_id } = req.body;
            let updatePayload = {};
            if (title)
                updatePayload.title = validator_1.default.escape(title);
            if (description)
                updatePayload.description = validator_1.default.escape(description);
            if (status) {
                if ((0, functions_1.isValidTodoStatus)(status))
                    updatePayload.status = validator_1.default.escape(status);
                else
                    return (0, functions_1.failRequest)(res, 400, `Your todo's status is not valid`);
            }
            if (deadline) {
                if (validator_1.default.isDate(deadline))
                    updatePayload.deadline = new Date(deadline);
                else
                    return (0, functions_1.failRequest)(res, 400, `Your date format is not valid`);
            }
            if (assignee_id)
                updatePayload.assignee_id = Number(assignee_id);
            if (group_id)
                updatePayload.group_id = Number(group_id);
            else if (group_id === null)
                updatePayload.group_id = null;
            // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
            if ((0, functions_1.isObjectEmpty)(updatePayload))
                return (0, functions_1.failRequest)(res, 400, `Your request doesn't have the adequate parameters`);
            yield toBeUpdatedTodo.update(updatePayload);
            res.json(toBeUpdatedTodo);
        }
        catch (err) {
            if (err.name == 'SequelizeUniqueConstraintError')
                (0, functions_1.failRequest)(res, 409, `You can't assign the todo to this user`);
            else
                (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function deleteTodoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const todo = yield todo_model_1.default.findByPk(id);
            if (!todo)
                return (0, functions_1.failRequest)(res, 404, `Todo not found`);
            const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            const currentUser = yield user_model_1.default.findByPk(currentUserId);
            // A user can't delete a todo he's not related to
            if (!(yield (0, functions_1.isUserRelatedToTodo)(currentUser, todo, currentUserId)))
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            yield todo.destroy();
            res.json({ message: 'Todo deleted successfully' });
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
function getAllTodoOfAuthor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        getAllTodoByCriteria(req, res, "author");
    });
}
function getAllTodoOfAssignee(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        getAllTodoByCriteria(req, res, "assignee");
    });
}
function getAllTodoOfGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.group_id);
        if (!id)
            return (0, functions_1.failRequest)(res, 400, 'Invalid group ID');
        const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
        const currentUser = yield user_model_1.default.findByPk(currentUserId);
        // If the user isn't inside the group, he can't access the todos
        if (!(yield currentUser.hasGroup(id)))
            return (0, functions_1.failRequest)(res, 401, 'Unauthorized');
        const todos = yield todo_model_1.default.findAll({
            where: {
                group_id: id
            },
            include: [
                {
                    model: user_model_1.default,
                    as: 'assignee',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: user_model_1.default,
                    as: 'author',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: group_model_1.default,
                    as: 'group'
                }
            ]
        });
        res.json(todos);
    });
}
// Utility function used for DRY, not an actual endpoint
function getAllTodoByCriteria(req, res, criteria) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = Number(req.params.user_id);
            if (!userId)
                return (0, functions_1.failRequest)(res, 400, 'Invalid ID');
            const currentUserId = (0, functions_1.decodeJwtToken)(req.headers.authorization, jwt_strategy_1.secret).id;
            if (userId !== currentUserId)
                return (0, functions_1.failRequest)(res, 401, `Unauthorized`);
            const todos = yield todo_model_1.default.findAll({
                where: criteria == "author" ? { author_id: userId } : { assignee_id: userId },
                include: [
                    {
                        model: user_model_1.default,
                        as: 'assignee',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: user_model_1.default,
                        as: 'author',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: group_model_1.default,
                        as: 'group'
                    }
                ]
            });
            res.json(todos);
        }
        catch (error) {
            console.error(error);
            (0, functions_1.failRequest)(res, 500, `Internal server error`);
        }
    });
}
//# sourceMappingURL=todo.route.js.map