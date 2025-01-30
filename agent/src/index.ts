import socketIO, { Socket } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Agent from "./agent";

dotenv.config();
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM4MjUxOTA0fQ.7-UkxYLIqoh0yE7OM0bo6CE1fprc1Mt7PVi1qX0gqao

class server {
  private __app: express.Application;
  private __socket: socketIO.Server<
    socketIO.DefaultEventsMap,
    socketIO.DefaultEventsMap,
    socketIO.DefaultEventsMap,
    any
  >;
  private __server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  private __port: number;
  private __tokenMap: Map<number, Agent>;

  constructor() {
    this.__tokenMap = new Map<number, Agent>();
    this.__port = parseInt(process.env.PORT || "8000");
    this.__app = express();
    this.__app.use(cors());
    this.__app.use(express.json());
    this.__server = http.createServer(this.__app);
    this.__socket = new socketIO.Server(this.__server);
    this.__socket.on("connection", (socket) => this.onConnect(socket));
  }

  onConnect(socket: socketIO.Socket) {
    console.log("Connection established");
    socket.on("token", (token) => {
        console.log("New agent is created");
      const agent = new Agent(token, socket);
      this.__tokenMap.set(token, agent);
    });

    console.log("Connection established with a user!"+socket.id);
  }

  startServer() {
    this.__server.listen(this.__port, () => {
      console.log(`Server is running on port ${this.__port}`);
    });
  }

  static output() {}
}

export default server;
