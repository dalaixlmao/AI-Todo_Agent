import jwt from "jsonwebtoken";
import repository from "../repository/repository";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";

class userController {
  private __repo: repository;
  constructor() {
    this.__repo = repository.getInstance();
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await hash(password, 10);
      const user = await this.__repo.__user.createUser(
        name,
        email,
        hashedPassword
      );
      const id = user.id;
      const token = jwt.sign({ id }, process.env.SECRET || "");
      res.status(200).json({ message: "User signed up successfully", token });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await hash(password, 10);
      const user = await this.__repo.__user.getUserByEmail(email);
      const check = await compare(password, hashedPassword);
      if (!check) {
        res.status(403).json({ message: "Wrong password!" });
        return;
      }
      const id = user?.id;
      const token = jwt.sign({ id }, process.env.SECRET || "");
      res.status(200).json({ message: "User signed in successfully", token });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default userController;