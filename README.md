# Real-Time Order Processing & Notification System

A real-time, event-driven microservices system built with **TypeScript, GraphQL, Apache Kafka, gRPC, PostgreSQL, and Docker**.

The system allows orders to be created through a GraphQL API, stores them in PostgreSQL, publishes real-time order events through Kafka, and communicates with a separate Notification Service using gRPC.

---

## 🚀 Project Overview

This project demonstrates a microservices-based architecture for real-time order processing and notification.

### Order Processing Flow

```text
Client
   │
   ▼
GraphQL API
   │
   ▼
Order Service
   │
   ├──────────────► PostgreSQL
   │
   ▼
Apache Kafka
   │
   ▼
Notification Service
   │
   ▼
gRPC Response
