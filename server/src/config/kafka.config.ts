import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
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

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "chats",
});

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected...");
};
