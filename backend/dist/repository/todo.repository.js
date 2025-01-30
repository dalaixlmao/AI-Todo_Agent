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
Object.defineProperty(exports, "__esModule", { value: true });
class todoRepo {
    constructor(client) {
        this.__db = client;
        this.createTodo = this.createTodo.bind(this);
        this.getTodoById = this.getTodoById.bind(this);
        this.getUsersTodo = this.getUsersTodo.bind(this);
        this.searchTodo = this.searchTodo.bind(this);
        this.deleteTodoById = this.deleteTodoById.bind(this);
    }
    createTodo(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__db.todo.create({
                data: {
                    title: data.title,
                    description: data.description,
                    remiderTime: data.reminderTime,
                    user: { connect: { id: userId } },
                },
            });
        });
    }
    getTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__db.todo.findUnique({ where: { id } });
        });
    }
    getUsersTodo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__db.todo.findMany({
                where: {
                    userId,
                },
            });
        });
    }
    searchTodo(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__db.todo.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: key,
                            },
                        },
                        {
                            description: {
                                contains: key,
                            },
                        },
                    ],
                },
            });
        });
    }
    deleteTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__db.todo.delete({ where: { id } });
        });
    }
}
exports.default = todoRepo;
