"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const user_repository_1 = __importDefault(require("./user.repository"));
const todo_repository_1 = __importDefault(require("./todo.repository"));
class repository {
    constructor() {
        this.__db = new client_1.PrismaClient();
        this.__user = new user_repository_1.default(this.__db);
        this.__todo = new todo_repository_1.default(this.__db);
    }
    static getInstance() {
        if (!this.__instance)
            this.__instance = new repository();
        return this.__instance;
    }
}
repository.__instance = null;
exports.default = repository;
