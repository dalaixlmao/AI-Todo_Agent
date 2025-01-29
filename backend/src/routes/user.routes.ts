import { Router } from "express";
import userController from "../controllers/user.controller";
import userMiddleware from "../middlewares/user.middleware";

class userRoute {
  private __router: Router;
  private __user_controller: userController;
  private __user_middleware: userMiddleware;

  constructor() {
    this.__router = Router();
    this.__user_controller = new userController();
    this.__user_middleware = new userMiddleware();

    this.__router.post(
      "/signup",
      this.__user_middleware.signupValidation,
      this.__user_middleware.singupMiddleware,
      this.__user_controller.createUser
    );
    this.__router.post(
      "/signin",
      this.__user_middleware.signinValidation,
      this.__user_controller.signIn
    );
  }

  getRouter() {
    return this.__router;
  }
}

export default userRoute;
