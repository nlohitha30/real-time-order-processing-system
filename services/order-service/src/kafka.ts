import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"],
});

export const producer = kafka.producer();