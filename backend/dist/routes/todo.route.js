"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_middleware_1 = __importDefault(require("../middlewares/todo.middleware"));
const todo_controller_1 = __importDefault(require("../controllers/todo.controller"));
class todoRoute {
    constructor() {
        this.__router = (0, express_1.Router)();
        this.__todo_controller = new todo_controller_1.default();
        this.__todo_middleware = new todo_middleware_1.default();
        this.__router.post("/create", this.__todo_middleware.todoValidation, this.__todo_middleware.authenticate, this.__todo_controller.createTodo);
        this.__router.get("/", this.__todo_middleware.authenticate, this.__todo_controller.getTodo);
        this.__router.get("/todos", this.__todo_middleware.authenticate, this.__todo_controller.getUserTodos);
        this.__router.get("/search", this.__todo_middleware.authenticate, this.__todo_controller.searchTodo);
        this.__router.delete("/remove", this.__todo_middleware.authenticate, this.__todo_controller.deleteTodo);
    }
    getRouter() {
        return this.__router;
    }
}
exports.default = todoRoute;
