/// <reference path="./custom-types.d.ts" />
import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config";
import { setupSocket } from "./socket";
import { connectKafkaProducer } from "./config/kafka.config";
import { setupChatConsumer } from "./consumers/ChatConsumer";
import Routes from "./routes/index";

const app: Application = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
  adapter: createAdapter(redis),
});

setupSocket(io);
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("QuickChat Server V1 is Running! 🚀");
});

app.use("/api", Routes);

export { app, server };

if (process.env.NODE_ENV !== "test") {
  // Connect Infrastructure
  connectKafkaProducer();
  setupChatConsumer();

  server.listen(PORT, () => console.log(`Server v1 is running on PORT ${PORT}`));
}
