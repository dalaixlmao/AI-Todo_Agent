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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        this.updateTodoById = this.updateTodoById.bind(this);
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
    updateTodoById(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = {
                id: parseInt(data.id),
            };
            var { id } = data, updateData = __rest(data, ["id"]);
            return yield this.__db.todo.update({
                where: {
                    id: parseInt(data.id),
                },
                data: updateData,
            });
        });
    }
}
exports.default = todoRepo;
