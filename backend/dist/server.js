"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const todo_route_1 = __importDefault(require("./routes/todo.route"));
class Application {
    constructor() {
        this.__user_route = new user_routes_1.default();
        this.__todo_route = new todo_route_1.default();
        this.__app = (0, express_1.default)();
        this.__app.use((0, cors_1.default)());
        this.__app.use(express_1.default.json());
        this.__app.use("/api/v1/user", this.__user_route.getRouter());
        this.__app.use("/api/v1/todo", this.__todo_route.getRouter());
    }
    startServer() {
        this.__app.listen(Application.__port, () => {
            console.log(`Application is running on port ${Application.__port}`);
        });
    }
}
Application.__port = 3000;
exports.default = Application;
