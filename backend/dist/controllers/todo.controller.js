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
const repository_1 = __importDefault(require("../repository/repository"));
const logger_1 = __importDefault(require("../logger"));
class todoController {
    constructor() {
        this.__repo = repository_1.default.getInstance();
        this.getTodo = this.getTodo.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.getUserTodos = this.getUserTodos.bind(this);
        this.searchTodo = this.searchTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
    }
    createTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user_id = req.user_id;
                const todo = yield this.__repo.__todo.createTodo(data, user_id);
                logger_1.default.getInstance().info("New todo is created: ", todo);
                res.status(200).json({ message: "New todo created", id: todo.id });
            }
            catch (e) {
                logger_1.default.getInstance().error(e.message);
                res.status(500).json({ message: e.message });
            }
        });
    }
    getTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const todo = yield this.__repo.__todo.getTodoById(parseInt(id));
                logger_1.default.getInstance().info("Got your todo: ", todo);
                res.status(200).json({ message: "Got the todos!", todo });
            }
            catch (e) {
                logger_1.default.getInstance().error(e.message);
                res.status(500).json({ message: e.message });
            }
        });
    }
    getUserTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user_id;
                const todos = yield this.__repo.__todo.getUsersTodo(user_id);
                logger_1.default.getInstance().info("Got your todos: ", todos);
                res.status(200).json({ message: "Got the todos!", todos });
            }
            catch (e) {
                logger_1.default.getInstance().error(e.message);
                res.status(500).json({ message: e.message });
            }
        });
    }
    searchTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key } = req.params;
                const todos = yield this.__repo.__todo.searchTodo(key);
                logger_1.default.getInstance().info("Got your todos: ", todos);
                res.status(200).json({
                    message: todos.length > 0 ? "Got the todos!" : "No todos found!",
                    todos,
                });
            }
            catch (e) {
                logger_1.default.getInstance().error(e.message);
                res.status(500).json({ message: e.message });
            }
        });
    }
    deleteTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.__repo.__todo.deleteTodoById(parseInt(id));
                logger_1.default.getInstance().info("Your todo was deleted! ", response);
                res.status(200).json({
                    message: "Todo deleted successfully!",
                });
            }
            catch (e) {
                logger_1.default.getInstance().error(e.message);
                res.status(500).json({ message: e.message });
            }
        });
    }
}
exports.default = todoController;
