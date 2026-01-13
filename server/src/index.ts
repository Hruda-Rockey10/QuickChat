import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js"
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from './config/redis.config.js'

const corsOptions = {
  origin: [
    "https://quick-chat-nyan.vercel.app",
    "http://localhost:3000", // ✅ your frontend domain
    "https://admin.socket.io",             // ✅ optional: socket.io admin UI
  ],
  credentials: true, // ✅ allow cookies/auth headers
};

const app: Application = express();
const PORT = process.env.PORT || 10000;
import {Server} from 'socket.io'
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { instrument } from "@socket.io/admin-ui";
import { connectKafkaProducer } from "./config/kafka.config.js";
import { consumeMessages } from "./helper.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://quick-chat-nyan.vercel.app","http://localhost:3000", "https://admin.socket.io"],
    credentials: true
  },
  adapter: createAdapter(redis)
})

instrument(io, {
  auth: false,
  mode: "development",
});

setupSocket(io);
export {io};

// * Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

//Routes
app.use("/api" , Routes)

connectKafkaProducer().catch(err=>{console.log("Something went wrong while connecting kafka producer", err)})

consumeMessages("chats").catch(err=>{console.log("Something went wrong while connecting kafka consumer", err)})

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
