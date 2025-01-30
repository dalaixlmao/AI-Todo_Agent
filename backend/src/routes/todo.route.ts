import { Router } from "express";
import todoMiddleware from "../middlewares/todo.middleware";
import todoController from "../controllers/todo.controller";

class todoRoute {
  private __router: Router;
  private __todo_middleware: todoMiddleware;
  private __todo_controller: todoController;
  constructor() {
    this.__router = Router();
    this.__todo_controller = new todoController();
    this.__todo_middleware = new todoMiddleware();
    this.__router.post(
      "/create",
      this.__todo_middleware.todoValidation,
      this.__todo_middleware.authenticate,
      this.__todo_controller.createTodo
    );
    this.__router.get(
      "/",
      this.__todo_middleware.authenticate,
      this.__todo_controller.getTodo
    );
    this.__router.get(
      "/todos",
      this.__todo_middleware.authenticate,
      this.__todo_controller.getUserTodos
    );
    this.__router.get(
      "/search",
      this.__todo_middleware.authenticate,
      this.__todo_controller.searchTodo
    );
    this.__router.delete(
      "/remove",
      this.__todo_middleware.authenticate,
      this.__todo_controller.deleteTodo
    );
  }

  getRouter() {
    return this.__router;
  }
}

export default todoRoute;
