"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
class agent {
    constructor() {
        this.__agent = new openai_1.default();
        this.__system_prompt = `You are an AI To-Do List Assistant. You can manage tasks by adding, viewing, updating, and deleting.
        You must strictly follow the JSON output format.

        Available Tools:
        - getAllTodos
        `;
    }
    prompt(prompt) {
    }
}
exports.default = agent;
