import express from "express";
import cors from "cors";
import userRoute from "./routes/user.routes";
import todoRoute from "./routes/todo.route";

class Application {
  private __app: express.Application;
  private static __port = 3000;
  private __user_route: userRoute;
  private __todo_route: todoRoute;

  constructor() {
    this.__user_route = new userRoute();
    this.__todo_route = new todoRoute();
    this.__app = express();
    this.__app.use(cors());
    this.__app.use(express.json());
    this.__app.use("/api/v1/user", this.__user_route.getRouter());
    this.__app.use("/api/v1/todo", this.__todo_route.getRouter());
  }

  startServer() {
    this.__app.listen(Application.__port, () => {
      console.log(`Application is running on port ${Application.__port}`);
    });
  }
}

export default Application;
