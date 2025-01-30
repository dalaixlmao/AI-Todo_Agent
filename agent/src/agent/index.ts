import dotenv from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import { title } from "process";
import { error } from "console";
import { ChatCompletionMessageParam } from "openai/resources";
import { Key } from "readline";
import { Socket } from "socket.io";
import socketIO from "socket.io";

dotenv.config();

type ActionFunction =
  | "getTodoById"
  | "createTodo"
  | "getUserTodos"
  | "searchTodo"
  | "deleteTodoById";

interface GetTodoAction {
  type: "actions";
  function: "getTodoById";
  input: { id: number };
}

interface CreateTodoAction {
  type: "actions";
  function: "createTodo";
  input: { data: { title: string; description: string; reminderTime?: Date } };
}

interface GetUserTodosAction {
  type: "actions";
  function: "getUserTodos";
  input: Record<string, never>;
}

interface SearchTodoAction {
  type: "actions";
  function: "searchTodo";
  input: { key: string };
}

interface DeleteTodoAction {
  type: "actions";
  function: "deleteTodoById";
  input: { id: number };
}

interface OutputAction {
  type: "output";
  output: string;
}

// Union of all possible actions
type Action =
  | GetTodoAction
  | CreateTodoAction
  | GetUserTodosAction
  | SearchTodoAction
  | DeleteTodoAction
  | OutputAction;

class Agent {
  private __userToken: string;
  private __backend_url: string;
  private __tools;
  private __agent: OpenAI;
  private __messages: ChatCompletionMessageParam[];
  private __socket: socketIO.Socket;

  constructor(token: string, socket: socketIO.Socket) {
    this.__socket = socket;
    this.__agent = new OpenAI({ apiKey: process.env.OPEN_AI_KEY || "" });
    this.__userToken = token;
    this.__backend_url =
      process.env.BACKEND_URL || "http://localhost:3000/api/v1/todo";

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

  async createTodo(data: {
    title: string;
    description: string;
    reminderTime?: Date;
  }) {
    try {
      const res = await axios.post(`${this.__backend_url}/create`, {
        title: data.title,
        description: data.description,
        reminderTime: data.reminderTime,
      });
      return res.data.id;
    } catch (e: any) {
      throw error(e.message);
    }
  }

  async getUserTodos() {
    try {
      const res = await axios.get(`${this.__backend_url}/todos`, {
        headers: {
          Authorization: this.__userToken,
        },
      });
      return res.data.todos;
    } catch (e: any) {
      throw error(e.message);
    }
  }

  async getTodoById(id: number) {
    try {
      const res = await axios.get(`${this.__backend_url}/`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          id,
        },
      });
      return res.data.todo;
    } catch (e: any) {
      throw error(e.message);
    }
  }

  async deleteTodoById(id: number) {
    try {
      const res = await axios.delete(`${this.__backend_url}/delete`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          id,
        },
      });
      return res.data.message;
    } catch (e: any) {
      throw error(e.message);
    }
  }

  async searchTodo(key: string) {
    try {
      const res = await axios.get(`${this.__backend_url}/`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          key,
        },
      });
      return res.data.todos;
    } catch (e: any) {
      throw error(e.message);
    }
  }

  async input(query: string) {
    const userMessage = {
      type: "user",
      user: query,
    };
    this.__messages.push({
      role: "user",
      content: JSON.stringify(userMessage),
    });

    while (true) {
      const chat = await this.__agent.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.__messages,
        response_format: { type: "json_object" },
      });
      const result = chat.choices[0].message.content;
      this.__messages.push({ role: "assistant", content: result });

      const action = JSON.parse(result || "") as Action;

      if (action.type === "output") {
        this.output(action.output);
        break;
      } else if (action.type === "actions") {
        const validFunctions = [
          "getTodoById",
          "createTodo",
          "getUserTodos",
          "searchTodo",
          "deleteTodoById",
        ] as const;

        let response;
        if (validFunctions.includes(action.function)) {
          switch (action.function) {
            case "getTodoById": {
              response = await this.__tools.getTodoById(action.input.id);
              break;
            }
            case "createTodo": {
              response = await this.__tools.createTodo(action.input.data);
              break;
            }
            case "getUserTodos": {
              response = await this.__tools.getUserTodos();
              break;
            }
            case "searchTodo": {
              response = await this.__tools.searchTodo(action.input.key);
              break;
            }
            case "deleteTodoById": {
              response = await this.__tools.deleteTodoById(action.input.id);
              break;
            }
          }
          this.output(response);
        } else {
          throw new Error("Invalid response by chatgpt");
        }
      }
    }
  }

  output(message: any) {
    this.__socket.emit("ack", message, () => {
      console.log(message);
    });
  }

  private __getPrompt() {
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
- deleteTodoById(id: number): Deletes the todo with id = id, if it is done. 

Example:
START
{"type": "user", "user":"Add a task for shopping groceries."}
{"type" : "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{"type" : "output", "output": "Can you tell me what all items you want me to shop for?" }
{"type": "user", "user":"I want to shop for chocolates."}
{"type" : "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{"type": "action", "function" : "createTodo", "input":{"title":"Chocolates", "description": "Buy chocolates from groceries."}}
{"type": "observation", "observation": "New todo created!"}
`;
  }
}

export default Agent;
