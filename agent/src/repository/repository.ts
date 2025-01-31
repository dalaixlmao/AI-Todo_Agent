import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class repository {
  private __backend_url;
  private __userToken;

  constructor(userToken: string) {
    this.__backend_url = process.env.BACKEND_URL || "";
    this.__userToken = userToken;
    this.getTodoById = this.getTodoById.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.getUserTodos = this.getUserTodos.bind(this);
    this.searchTodo = this.searchTodo.bind(this);
    this.deleteTodoById = this.deleteTodoById.bind(this);
  }

  async createTodo(data: {
    title: string;
    description: string;
    reminderTime?: Date;
  }) {
    console.log("Creating todo...!");
    try {
      const res = await axios.post(
        `${this.__backend_url}/create`,
        {
          title: data.title,
          description: data.description,
          reminderTime: data.reminderTime,
        },
        {
          headers: {
            Authorization: this.__userToken,
          },
        }
      );
      return res.data.id;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async getUserTodos() {
    console.log("Getting todos...!");
    try {
      const res = await axios.get(`${this.__backend_url}/todos`, {
        headers: {
          Authorization: this.__userToken,
        },
      });
      return res.data.todos;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getTodoById(id: number) {
    console.log("Getting todo by id...!");
    try {
      const res = await axios.get(`${this.__backend_url}/`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          id,
        },
      });
      return res.data.todo;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async deleteTodoById(id: number) {
    console.log("Deleting todo...!");
    try {
      const res = await axios.delete(`${this.__backend_url}/delete`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          id,
        },
      });
      return res.data.message;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async searchTodo(key: string) {
    console.log("Searching todo...!");
    try {
      const res = await axios.get(`${this.__backend_url}/search`, {
        headers: {
          Authorization: this.__userToken,
        },
        params: {
          key,
        },
      });
      return res.data.todos;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default repository;
