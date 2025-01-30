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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const console_1 = require("console");
dotenv_1.default.config();
class Agent {
    constructor(token, socket) {
        this.__socket = socket;
        this.__userToken = token;
        this.__backend_url = process.env.BACKEND_URL || "http://localhost:3000/api/v1/todo";
        this.__huggingface_url = process.env.HUGGINGFACE_URL || "https://api-inference.huggingface.co/models/";
        this.__huggingface_token = process.env.HUGGINGFACE_API_KEY || "";
        // Bind methods
        this.getTodoById = this.getTodoById.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.getUserTodos = this.getUserTodos.bind(this);
        this.searchTodo = this.searchTodo.bind(this);
        this.deleteTodoById = this.deleteTodoById.bind(this);
        this.__tools = {
            getTodoById: this.getTodoById,
            createTodo: this.createTodo,
            getUserTodos: this.getUserTodos,
            searchTodo: this.searchTodo,
            deleteTodoById: this.deleteTodoById,
        };
        this.__messages = [{ role: "system", content: this.__getPrompt() }];
        this.__socket.on("query", (query) => {
            this.input(query);
        });
    }
    __queryHuggingFace(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.__huggingface_url}meta-llama/Llama-2-70b-chat-hf`, {
                    inputs: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n'),
                    parameters: {
                        max_length: 1000,
                        temperature: 0.7,
                        top_p: 0.95,
                        return_full_text: false
                    }
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.__huggingface_token}`,
                        'Content-Type': 'application/json'
                    }
                });
                // Parse the response to match our Action type
                try {
                    return JSON.parse(response.data[0].generated_text);
                }
                catch (e) {
                    throw new Error("Invalid response format from model");
                }
            }
            catch (e) {
                throw new Error(`Hugging Face API error: ${e.message}`);
            }
        });
    }
    createTodo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(`${this.__backend_url}/create`, {
                    title: data.title,
                    description: data.description,
                    reminderTime: data.reminderTime,
                });
                return res.data.id;
            }
            catch (e) {
                throw (0, console_1.error)(e.message);
            }
        });
    }
    getUserTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${this.__backend_url}/todos`, {
                    headers: {
                        Authorization: this.__userToken,
                    },
                });
                return res.data.todos;
            }
            catch (e) {
                throw (0, console_1.error)(e.message);
            }
        });
    }
    getTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw (0, console_1.error)(e.message);
            }
        });
    }
    deleteTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw (0, console_1.error)(e.message);
            }
        });
    }
    searchTodo(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${this.__backend_url}/`, {
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
                throw (0, console_1.error)(e.message);
            }
        });
    }
    input(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMessage = {
                type: "user",
                user: query,
            };
            this.__messages.push({
                role: "user",
                content: JSON.stringify(userMessage),
            });
            while (true) {
                const action = yield this.__queryHuggingFace(this.__messages);
                this.__messages.push({
                    role: "assistant",
                    content: JSON.stringify(action)
                });
                if (action.type === "output") {
                    this.output(action.output);
                    break;
                }
                else if (action.type === "actions") {
                    const validFunctions = [
                        "getTodoById",
                        "createTodo",
                        "getUserTodos",
                        "searchTodo",
                        "deleteTodoById",
                    ];
                    let response;
                    if (validFunctions.includes(action.function)) {
                        switch (action.function) {
                            case "getTodoById": {
                                response = yield this.__tools.getTodoById(action.input.id);
                                break;
                            }
                            case "createTodo": {
                                response = yield this.__tools.createTodo(action.input.data);
                                break;
                            }
                            case "getUserTodos": {
                                response = yield this.__tools.getUserTodos();
                                break;
                            }
                            case "searchTodo": {
                                response = yield this.__tools.searchTodo(action.input.key);
                                break;
                            }
                            case "deleteTodoById": {
                                response = yield this.__tools.deleteTodoById(action.input.id);
                                break;
                            }
                        }
                        this.output(response);
                    }
                    else {
                        throw new Error("Invalid response from model");
                    }
                }
            }
        });
    }
    output(message) {
        this.__socket.emit("ack", message, () => {
            console.log(message);
        });
    }
    __getPrompt() {
        return `You are an AI TO-Do List Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools
After planning, take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, return the AI response based on START prompt and observation.

You can manage tasks by adding, viewing, searching and deleting.
You must strictly follow the JSON output format.

Todo DB Schema:
- id Int @id @default(autoincrement())
- title String
- description String
- created_at DateTime @default(now())
- remiderTime DateTime?
- completed Boolean @default(false)
- userId Int
- user user @relation(fields: [userId], references: [id])

Here you should note that although there is a completed parameter in DB schema of Todo, but you don't need to make any query having completed as parameter to it, as it is automatically handled by the backend.

Available Tools:
- createTodo(data: { title: string, description: string,  reminderTime?: Date}): Creates a new todo in the DB and takes todo as a string, description as a string and reminderTime for that todo as a date wich is OPTIONAL, and returns todo id.
- getTodoById(id: number): Returns a todo with given id, else throws an error.
- getUserTodos(): Return all the todos that user has.
- searchTodo(key:string): Searches for all todos which contains specific key in title or description.
- deleteTodoById(id: number): Deletes the todo with id = id, if it is done.`;
    }
}
exports.default = Agent;
