"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = void 0;
const passport_jwt_1 = require("passport-jwt");
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
const secret = process.env.JWT_SECRET;
exports.secret = secret;
const jwtStrategy = new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}, (payload, done) => {
    user_model_js_1.default.findByPk(payload.id)
        .then((user) => {
        if (user)
            return done(null, user);
        return done(null, false);
    })
        .catch((err) => {
        console.error('Error in finding user by ID in JWT');
    });
});
exports.default = jwtStrategy;
//# sourceMappingURL=jwt_strategy.js.map