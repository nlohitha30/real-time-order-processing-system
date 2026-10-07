import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { pool } from "./database.js";
import { producer } from "./kafka.js";
import { sendNotification } from "./grpc-client.js";
// Connect to Kafka
await producer.connect();
console.log("✅ Kafka producer connected");

// Test PostgreSQL connection
await pool.query("SELECT NOW()");
console.log("✅ PostgreSQL connection successful");

const typeDefs = `#graphql
  type Order {
    id: ID!
    customerId: String!
    product: String!
    quantity: Int!
    status: String!
    createdAt: String!
  }

  type Query {
    health: String
    orders: [Order!]!
  }

  type Mutation {
    createOrder(
      customerId: String!
      product: String!
      quantity: Int!
    ): Order!
  }
`;

const resolvers = {
  Query: {
    health: () => "Order Service is running",

    orders: async () => {
      const result = await pool.query(`
        SELECT
          id,
          customer_id,
          product,
          quantity,
          status,
          created_at
        FROM orders
        ORDER BY created_at DESC
      `);

      return result.rows.map((order) => ({
        id: order.id,
        customerId: order.customer_id,
        product: order.product,
        quantity: order.quantity,
        status: order.status,
        createdAt: order.created_at.toISOString(),
      }));
    },
  },

  Mutation: {
    createOrder: async (
      _: unknown,
      {
        customerId,
        product,
        quantity,
      }: {
        customerId: string;
        product: string;
        quantity: number;
      }
    ) => {
      // Save order to PostgreSQL
      const result = await pool.query(
        `
        INSERT INTO orders
          (customer_id, product, quantity, status)
        VALUES
          ($1, $2, $3, 'CREATED')
        RETURNING
          id,
          customer_id,
          product,
          quantity,
          status,
          created_at
        `,
        [customerId, product, quantity]
      );

      const order = result.rows[0];

      // Publish ORDER_CREATED event to Kafka
      await producer.send({
        topic: "order-events",
        messages: [
          {
            key: String(order.id),
            value: JSON.stringify({
              event: "ORDER_CREATED",
              orderId: order.id,
              customerId: order.customer_id,
              product: order.product,
              quantity: order.quantity,
              status: order.status,
              createdAt: order.created_at,
            }),
          },
        ],
      });

      console.log(
        `📨 ORDER_CREATED event published for order ${order.id}`
      );
      // Send notification through gRPC
const notificationResponse = await sendNotification({
  orderId: String(order.id),
  customerId: order.customer_id,
  product: order.product,
  quantity: order.quantity,
  status: order.status,
});

console.log("📡 gRPC Notification Response:", notificationResponse);

      // Return created order
      return {
        id: order.id,
        customerId: order.customer_id,
        product: order.product,
        quantity: order.quantity,
        status: order.status,
        createdAt: order.created_at.toISOString(),
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`🚀 Order Service running at ${url}`);