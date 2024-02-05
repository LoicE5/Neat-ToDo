"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./db"));
const auth_route_1 = __importDefault(require("./src/routes/auth.route"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const jwt_strategy_1 = __importDefault(require("./src/utils/jwt_strategy"));
const todo_route_1 = __importDefault(require("./src/routes/todo.route"));
const group_route_1 = __importDefault(require("./src/routes/group.route"));
const functions_1 = require("./src/utils/functions");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
passport_1.default.use(jwt_strategy_1.default);
app.use(express_1.default.json());
app.use(express_1.default.text());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000', // Local
        /https:\/\/.*-loicprojects\.vercel\.app$/, // Preview
        'https://neat-todo.vercel.app/' // Prod
    ]
}));
app.use('/api/auth', auth_route_1.default);
app.use('/api/user', passport_1.default.authenticate('jwt', { session: false }), user_route_1.default);
app.use('/api/todo', passport_1.default.authenticate('jwt', { session: false }), todo_route_1.default);
app.use('/api/group', passport_1.default.authenticate('jwt', { session: false }), group_route_1.default);
app.all('/api', (req, res) => (0, functions_1.failRequest)(res, 418, `You cannot pour coffee here, please use tea instead.`));
db_1.default.sync({ force: false }).then(() => {
    console.info('The database have been synced');
});
app.listen(port, () => console.info(`The server is listening to the port ${port}`));
exports.default = app;
//# sourceMappingURL=index.js.map