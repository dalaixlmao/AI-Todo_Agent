import { PrismaClient, todo } from "@prisma/client";
import userRepo from "./user.repository";
import todoRepo from "./todo.repository";

class repository {
  private __db: PrismaClient;
  private static __instance: repository | null = null;
  __user: userRepo;
  __todo: todoRepo;
  private constructor() {
    this.__db = new PrismaClient();
    this.__user = new userRepo(this.__db);
    this.__todo = new todoRepo(this.__db);
  }
  
  static getInstance() {
    if (!this.__instance) this.__instance = new repository();
    return this.__instance;
  }
}

export default repository;
