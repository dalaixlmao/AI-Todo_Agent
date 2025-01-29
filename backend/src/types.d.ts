import { Request, Express } from "express"

declare global{
    namespace Express{
        interface Request{
            user_id:number
        }
    }
}


interface createTodo {
  title: string;
  description: string;
  reminderTime?: Date;
}


export default createTodo;