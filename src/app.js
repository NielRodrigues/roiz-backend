// eslint-disable-next-line import/no-extraneous-dependencies
import cors from "cors";
import "dotenv/config";
import express from "express";
import routes from "./routes";
import authMiddleware from "./apps/middlewares/auth";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: process.env.BASE_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "authorization"],
      })
    );
    this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
