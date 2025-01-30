"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const agent_1 = __importDefault(require("./agent"));
dotenv_1.default.config();
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM4MjUxOTA0fQ.7-UkxYLIqoh0yE7OM0bo6CE1fprc1Mt7PVi1qX0gqao
class server {
    constructor() {
        this.__tokenMap = new Map();
        this.__port = parseInt(process.env.PORT || "8000");
        this.__app = (0, express_1.default)();
        this.__app.use((0, cors_1.default)());
        this.__app.use(express_1.default.json());
        this.__server = http_1.default.createServer(this.__app);
        this.__socket = new socket_io_1.default.Server(this.__server);
        this.__socket.on("connection", (socket) => this.onConnect(socket));
    }
    onConnect(socket) {
        console.log("Connection established");
        socket.on("token", (token) => {
            console.log("New agent is created");
            const agent = new agent_1.default(token, socket);
            this.__tokenMap.set(token, agent);
        });
        console.log("Connection established with a user!" + socket.id);
    }
    startServer() {
        this.__server.listen(this.__port, () => {
            console.log(`Server is running on port ${this.__port}`);
        });
    }
    static output() { }
}
exports.default = server;
