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
const generative_ai_1 = require("@google/generative-ai");
const repository_1 = __importDefault(require("../repository/repository"));
const console_1 = require("console");
dotenv_1.default.config();
/*
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM4MjUxOTA0fQ.7-UkxYLIqoh0yE7OM0bo6CE1fprc1Mt7PVi1qX0gqao
Hi, I am getting bored and I feel I should go to watch movie this weekend.
 Oh no, I forgot I have gaming night with my friends on the weekend.
*/
class Agent {
    constructor(token, socket) {
        this.__socket = socket;
        this.__agent = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        this.__model = this.__agent.getGenerativeModel({
            model: "gemini-2.0-flash",
        });
        this.__userToken = token;
        this.__repo = new repository_1.default(this.__userToken);
        this.__tools = {
            getTodoById: this.__repo.getTodoById,
            createTodo: this.__repo.createTodo,
            getUserTodos: this.__repo.getUserTodos,
            searchTodo: this.__repo.searchTodo,
            deleteTodoById: this.__repo.deleteTodoById,
        };
        this.__messages = [this.__getPrompt()];
        this.__socket.on("query", (query) => this.input(query));
    }
    parseResponse(response) {
        try {
            const matches = response.match(/\{[^{}]*\}/g);
            if (!matches)
                return [];
            return matches.map((jsonStr) => JSON.parse(jsonStr));
        }
        catch (error) {
            console.error("Error parsing AI response:", error);
            return [];
        }
    }
    executeFunction(fnName, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(fnName in this.__tools))
                throw new Error(`Invalid function: ${fnName}`);
            return yield this.__tools[fnName](...(input ? Object.values(input) : []));
        });
    }
    input(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.__messages.push(JSON.stringify({ type: "system", system: this.__getPrompt() }), JSON.stringify({ type: "user", user: query }));
            while (true) {
                let flag = 0;
                try {
                    const chat = yield this.__model.generateContent(JSON.stringify(this.__messages));
                    const responses = this.parseResponse(chat.response.text());
                    (0, console_1.log)(responses);
                    for (const res of responses) {
                        console.log("\n-----------------------------------------\n", res, "\n-----------------------------------------\n");
                        if (res.type === "output" && res.output) {
                            this.output(res.output);
                            flag++;
                            break;
                        }
                        else if (res.type === "actions" && res.function) {
                            const result = yield this.executeFunction(res.function, res.input);
                            this.__messages.push(JSON.stringify({ res }));
                        }
                        else if (res.type === "plan" ||
                            res.type === "user" ||
                            res.type === "observation") {
                            this.__messages.push(JSON.stringify({ res }));
                        }
                        else {
                            this.__messages.push(this.__getPrompt());
                        }
                    }
                    this.__messages.push(this.__getPrompt());
                    if (responses.some((res) => res.type === "output") || flag > 0)
                        break;
                }
                catch (error) {
                    console.error("Error processing AI response:", error);
                    break;
                }
            }
        });
    }
    output(message) {
        this.__socket.emit("ack", message, () => console.log("Sent:", message));
    }
    __getPrompt() {
        return `
You are an AI TO-Do List Assistant with START, PLAN, ACTION, Observation and Outut State.
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
- completed Boolean @default(false)
- userId Int
- user user @relation(fields: [userId], references: [id])

Here you should note that although there is a completed parameter in DB schema of Todo, but you don't need to make any query having completed as parameter to it, as it is automatically handled by the backend.

Available Tools:
- createTodo(data: { title: string, description: string,  reminderTime?: Date}): Creates a new todo in the DB and takes todo as a string, description as a string and reminderTime for that todo as a date wich is OPTIONAL, and returns todo id.
- getTodoById(id: number): Returns a todo with given id, else throws an error.
- getUserTodos(): Return all the todos that user has.
- searchTodo(key:string): Searches for all todos which contains specific key in title or description.
- deleteTodoById(id: number): Deletes the todo with id = id, if it is done. 

✅ Correct Example:
START
{"type": "user", "user":"Add a task for shopping groceries."}
{"type" : "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{"type" : "output", "output": "Can you tell me what all items you want me to shop for?" }
{"type": "user", "user":"I want to shop for chocolates."}
{"type" : "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{"type": "action", "function" : "createTodo", "input":{"title":"Chocolates", "description": "Buy chocolates from groceries."}}
{"type": "observation", "observation": "New todo created!"} 

❌ Wrong Example:
START
{"title": "I have to add a new todo", "description":"User asked me to add a new todo"}


Note: Second example is wrong because the JSON object does not has a key called "type", rather it is having a key called "title" which is not mentioned in the rules. Hence the correct way to perform an operation is by responding with an object with type as action and with function as in what function to apply and it's input type. Follow the above rules for correct input type and functions.
`;
    }
}
exports.default = Agent;
