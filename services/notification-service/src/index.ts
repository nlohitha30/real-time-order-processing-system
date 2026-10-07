import { consumer } from "./kafka.js";

const startNotificationService = async () => {
  await consumer.connect();

  console.log("✅ Notification Service connected to Kafka");

  await consumer.subscribe({
    topic: "order-events",
    fromBeginning: true,
  });

  console.log("👂 Listening for order events...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }

      const event = JSON.parse(message.value.toString());

      console.log("🔔 New Order Notification");
      console.log(`Order ID: ${event.orderId}`);
      console.log(`Customer: ${event.customerId}`);
      console.log(`Product: ${event.product}`);
      console.log(`Quantity: ${event.quantity}`);
      console.log(`Status: ${event.status}`);
      console.log("--------------------------------");
    },
  });
};

startNotificationService().catch((error) => {
  console.error("❌ Notification Service error:", error);
});