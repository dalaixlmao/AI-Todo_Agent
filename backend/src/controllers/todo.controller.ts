import { Request, Response } from "express";
import repository from "../repository/repository";
import createTodo from "../types";

class todoController {
  private __repo: repository;

  constructor() {
    this.__repo = repository.getInstance();
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
      const { id } = req.body;
      const todo = await this.__repo.__todo.getTodoById(id);
      res.status(200).json({ message: "New todo created", todo });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async getUserTodos(req: Request, res: Response) {
    try {
        const user_id = req.user_id;
      const todos = await this.__repo.__todo.getUsersTodo(user_id);
      res.status(200).json({ message: "New todo created", todos });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default todoController;