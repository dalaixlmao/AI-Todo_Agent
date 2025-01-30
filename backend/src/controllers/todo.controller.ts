import { Request, Response } from "express";
import repository from "../repository/repository";
import createTodo from "../types";

class todoController {
  private __repo: repository;

  constructor() {
    this.__repo = repository.getInstance();
    this.getTodo = this.getTodo.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.getUserTodos = this.getUserTodos.bind(this);
    this.searchTodo = this.searchTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  async createTodo(req: Request, res: Response) {
    try {
      const data: createTodo = req.body;
      const user_id = req.user_id;
      const todo = await this.__repo.__todo.createTodo(data, user_id);
      res.status(200).json({ message: "New todo created", id: todo.id });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async getTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const todo = await this.__repo.__todo.getTodoById(parseInt(id));
      res.status(200).json({ message: "Got the todos!", todo });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async getUserTodos(req: Request, res: Response) {
    try {
      const user_id = req.user_id;
      const todos = await this.__repo.__todo.getUsersTodo(user_id);
      res.status(200).json({ message: "Got the todos!", todos });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async searchTodo(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const todos = await this.__repo.__todo.searchTodo(key);
      res.status(200).json({
        message: todos.length > 0 ? "Got the todos!" : "No todos found!",
        todos,
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await this.__repo.__todo.deleteTodoById(parseInt(id));
      res.status(200).json({
        message: "Todo deleted successfully!",
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default todoController;
