import { Request, Response, NextFunction } from "express";
import zod from "zod";
import repository from "../repository/repository";

const userSignupSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

const userSigninSchema = userSignupSchema.omit({ name: true });

class userMiddleware {
  private __repo: repository;
  constructor() {
    this.__repo = repository.getInstance();
    this.singupMiddleware = this.singupMiddleware.bind(this);
    this.signinValidation = this.signinValidation.bind(this);
  }

  signupValidation(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    console.log(data);
    const check = userSignupSchema.safeParse(data);
    console.log(check.success ? "Passed validation" : "Failed validation");
    if (check.success) {
      next();
      return;
    }
    res.status(422).json({ message: "Wrong Inputs" });
  }
  signinValidation(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const check = userSigninSchema.safeParse(data);

    if (check.success) {
      next();
      return;
    }

    res.status(422).json({ message: "Wrong Inputs" });
  }

  async singupMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const user = await this.__repo.__user.getUserByEmail(email);
    if (!user) {
      console.log("Here right now, user not found");
      next();
      return;
    } else {
      res
        .status(500)
        .json({ message: "User already exist with your mentioned email!" });
    }
  }
}

export default userMiddleware;
