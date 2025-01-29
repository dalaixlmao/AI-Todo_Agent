import { PrismaClient } from "@prisma/client";

class userRepo {
  private __db: PrismaClient;

  constructor(client: PrismaClient) {
    this.__db = client;
    this.createUser = this.createUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }

  async createUser(name: string, email: string, password: string) {
    return await this.__db.user.create({ data: { name, email, password } });
  }

  async getUserById(id: number) {
    return await this.__db.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.__db.user.findUnique({ where: { email } });
  }
}

export default userRepo;
