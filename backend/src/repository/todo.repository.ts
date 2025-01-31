import { Prisma, PrismaClient } from "@prisma/client";
import createTodo from "../types";

class todoRepo {
  private __db: PrismaClient;

  constructor(client: PrismaClient) {
    this.__db = client;
    this.createTodo = this.createTodo.bind(this);
    this.getTodoById = this.getTodoById.bind(this);
    this.getUsersTodo = this.getUsersTodo.bind(this);
    this.searchTodo = this.searchTodo.bind(this);
    this.deleteTodoById = this.deleteTodoById.bind(this);
    this.updateTodoById = this.updateTodoById.bind(this);
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

  async searchTodo(key: string) {
    return await this.__db.todo.findMany({
      where: {
        OR: [
          {
            title: {
              contains: key,
            },
          },
          {
            description: {
              contains: key,
            },
          },
        ],
      },
    });
  }

  async deleteTodoById(id: number) {
    return await this.__db.todo.delete({ where: { id } });
  }

  async updateTodoById(data: {
    id: string;
    title?: string;
    description?: string;
    reminderTime?: string;
  }) {
    const newData = {
      id: parseInt(data.id),
    }
    var { id, ...updateData } = data;
    return await this.__db.todo.update({
      where: {
        id: parseInt(data.id),
      },
      data: updateData,
    });
  }
}

export default todoRepo;
