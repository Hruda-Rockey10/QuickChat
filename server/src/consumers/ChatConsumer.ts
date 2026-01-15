import { consumer } from "../config/kafka.config";
import prisma from "../config/db.config";

export const setupChatConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || "chats", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
            if (message.value) {
                const data = JSON.parse(message.value.toString());
                
                // 3. Save to Database
                await prisma.chats.create({
                    data: {
                        group_id: data.group_id,
                        message: data.message,
                        name: data.name,
                        created_at: data.created_at
                    }
                });
                console.log("Message saved to DB:", data.message);
            }
        } catch (err) {
            console.error("Error processing Kafka message:", err);
        }
      },
    });
    console.log("Kafka Consumer Listening...");
  } catch (error) {
    console.error("Kafka Consumer Error:", error);
  }
};
