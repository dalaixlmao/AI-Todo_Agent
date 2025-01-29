import { Request, Response, NextFunction, Express } from "express";
import zod from "zod";
import repository from "../repository/repository";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const todoBodyValidation = zod.object({
  description: zod.string(),
  title: zod.string(),
  reminderTime: zod.date().optional(),
});

class todoMiddleware {
  private __repo: repository;
  constructor() {
    this.__repo = repository.getInstance();
    this.authenticate = this.authenticate.bind(this);
  }

  todoValidation(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const check = todoBodyValidation.safeParse(body);
    if (check.success) {
      next();
    } else {
      res.status(422).json({ message: "Wrong Input!" });
    }
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(422).json({ message: "No authorization token was found!" });
      return;
    }
    try {
      const decode = jwt.verify(token, process.env.SECRET || "") as JwtPayload;
      req.user_id = parseInt(decode.id);
      const user = await this.__repo.__user.getUserById(req.user_id);
      if (user) next();
      else res.status(500).json({ message: "Wrong user reference!" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default todoMiddleware;
