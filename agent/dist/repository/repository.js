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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class repository {
    constructor(userToken) {
        this.__backend_url = process.env.BACKEND_URL || "";
        this.__userToken = userToken;
        this.getTodoById = this.getTodoById.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.getUserTodos = this.getUserTodos.bind(this);
        this.searchTodo = this.searchTodo.bind(this);
        this.deleteTodoById = this.deleteTodoById.bind(this);
    }
    createTodo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating todo...!");
            try {
                const res = yield axios_1.default.post(`${this.__backend_url}/create`, {
                    title: data.title,
                    description: data.description,
                    reminderTime: data.reminderTime,
                }, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                });
                return res.data.id;
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getUserTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Getting todos...!");
            try {
                const res = yield axios_1.default.get(`${this.__backend_url}/todos`, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                });
                return res.data.todos;
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Getting todo by id...!");
            try {
                const res = yield axios_1.default.get(`${this.__backend_url}/`, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                    params: {
                        id,
                    },
                });
                return res.data.todo;
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    deleteTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting todo...!");
            try {
                const res = yield axios_1.default.delete(`${this.__backend_url}/delete`, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                    params: {
                        id,
                    },
                });
                return res.data.message;
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    searchTodo(key) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Searching todo...!");
            try {
                const res = yield axios_1.default.get(`${this.__backend_url}/search`, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                    params: {
                        key,
                    },
                });
                return res.data.todos;
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
}
exports.default = repository;
