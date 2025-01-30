"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_middleware_1 = __importDefault(require("../middlewares/user.middleware"));
class userRoute {
    constructor() {
        this.__router = (0, express_1.Router)();
        this.__user_controller = new user_controller_1.default();
        this.__user_middleware = new user_middleware_1.default();
        this.__router.post("/signup", this.__user_middleware.signupValidation, this.__user_middleware.singupMiddleware, this.__user_controller.createUser);
        this.__router.post("/signin", this.__user_middleware.signinValidation, this.__user_controller.signIn);
    }
    getRouter() {
        return this.__router;
    }
}
exports.default = userRoute;
