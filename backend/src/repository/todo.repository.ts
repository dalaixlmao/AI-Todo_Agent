import { PrismaClient } from "@prisma/client";
import createTodo from "../types";


class todoRepo {
  private __db: PrismaClient;

  constructor(client: PrismaClient) {
    this.__db = client;
    this.createTodo = this.createTodo.bind(this);
    this.getTodoById = this.getTodoById.bind(this);
    this.getUsersTodo = this.getUsersTodo.bind(this);
  }

  async createTodo(data: createTodo, userId: number) {
    return await this.__db.todo.create({
      data: {
        title: data.title,
        description: data.description,
        remiderTime: data.reminderTime,
        user: { connect: { id: userId } },
      },
    });
  }

  async getTodoById(id: number) {
    return await this.__db.todo.findUnique({ where: { id } });
  }

  async getUsersTodo(userId: number) {
    return await this.__db.todo.findMany({
      where: {
        userId,
      },
    });
  }
}

export default todoRepo;
