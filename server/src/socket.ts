import { Server, Socket } from "socket.io";
import { producer } from "./config/kafka.config";

interface CustomSocket extends Socket {
  room?: string;
}

export const setupSocket = (io: Server) => {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.join(socket.room!);
    console.log(`Socket connected: ${socket.id} in room ${socket.room}`);

    socket.on("message", async (data) => {
      // 1. Send to Everyone Else (Instant)
      socket.to(socket.room!).emit("message", data);

      // 2. Save to DB (Background via Kafka)
      try {
          if (process.env.KAFKA_TOPIC) {
            await producer.send({
                topic: process.env.KAFKA_TOPIC,
                messages: [{ value: JSON.stringify(data) }],
            });
          }
      } catch (error) {
          console.error("Kafka Produce Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};


