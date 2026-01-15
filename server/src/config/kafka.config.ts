import { Kafka, Producer, Consumer } from "kafkajs";

export const kafka = new Kafka({
  clientId: "quick-chat-app",
  brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
  ssl: process.env.KAFKA_SSL === "true",
  sasl:
    process.env.KAFKA_API_KEY && process.env.KAFKA_API_SECRET
      ? {
          mechanism: "plain",
          username: process.env.KAFKA_API_KEY,
          password: process.env.KAFKA_API_SECRET,
        }
      : undefined,
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: "chats-v1-group" });

export const connectKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka Producer Connected...");
    } catch (error) {
        console.error("Kafka Producer Connection Error:", error);
    }
};
