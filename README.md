# Real-Time Order Processing & Notification System

A real-time microservices-based order processing and notification system built using TypeScript, GraphQL, Apache Kafka, gRPC, PostgreSQL, and Docker.

## Project Overview

This project demonstrates how an order is created, stored, processed, and notified using modern backend technologies.

### Order Flow

```text
GraphQL
   ↓
Order Service
   ↓
PostgreSQL
   ↓
Apache Kafka
   ↓
Notification Service
   ↓
gRPC
```

## Technologies Used

* TypeScript
* Node.js
* GraphQL
* Apache Kafka
* gRPC
* PostgreSQL
* Docker
* Docker Compose

## Main Features

* Create orders using GraphQL
* Store orders in PostgreSQL
* Publish order events using Apache Kafka
* Process order events using Notification Service
* Communicate between services using gRPC
* Run all services using Docker Compose

## Project Structure

```text
real-time-order-processing-system/
│
├── docker-compose.yml
├── proto/
│   └── notification.proto
│
└── services/
    ├── order-service/
    │   └── src/
    │       ├── database.ts
    │       ├── kafka.ts
    │       ├── grpc-client.ts
    │       └── server.ts
    │
    └── notification-service/
        └── src/
            ├── kafka.ts
            ├── index.ts
            └── grpc-server.ts
```

## GraphQL API

The Order Service runs on:

[http://localhost:4000](http://localhost:4000)

### Health Check

```graphql
query {
  health
}
```

Response:

```json
{
  "data": {
    "health": "Order Service is running"
  }
}
```

### Create Order

```graphql
mutation {
  createOrder(
    customerId: "C100"
    product: "Wireless Mouse"
    quantity: 2
  ) {
    id
    customerId
    product
    quantity
    status
    createdAt
  }
}
```

Successful order:

```text
Order ID: 6
Customer ID: C100
Product: Wireless Mouse
Quantity: 2
Status: CREATED
```

## Kafka

Apache Kafka is used for real-time order events.

Kafka Topic:

```text
order-events
```

Example event:

```json
{
  "event": "ORDER_CREATED",
  "orderId": 6,
  "customerId": "C100",
  "product": "Wireless Mouse",
  "quantity": 2,
  "status": "CREATED"
}
```

## gRPC

The Order Service communicates with the Notification Service using gRPC.

Port:

```text
50051
```

Example response:

```text
Notification processed for order 6
```

## PostgreSQL

PostgreSQL is used to store order information.

## Docker

Start the complete application:

```bash
docker compose up --build
```

Stop the application:

```bash
docker compose down
```

## Testing

The complete system was successfully tested:

```text
GraphQL
   ↓
Order Service
   ↓
PostgreSQL
   ↓
Kafka
   ↓
Notification Service
   ↓
gRPC
```

## Author

**Lohitha Nemallapudi**

GitHub: https://github.com/nlohitha30

## License

This project is created for educational and portfolio purposes.
