import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  process.env.DOCKER_ENV === "true"
    ? "../proto/notification.proto"
    : "../../../proto/notification.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const notificationProto = grpc.loadPackageDefinition(
  packageDefinition
) as any;

const sendNotification = (
  call: any,
  callback: any
) => {
  const request = call.request;

  console.log("📨 gRPC Notification Request");
  console.log(`Order ID: ${request.orderId}`);
  console.log(`Customer: ${request.customerId}`);
  console.log(`Product: ${request.product}`);
  console.log(`Quantity: ${request.quantity}`);
  console.log(`Status: ${request.status}`);

  callback(null, {
    success: true,
    message: `Notification processed for order ${request.orderId}`,
  });
};

const server = new grpc.Server();

server.addService(
  notificationProto.notification.NotificationService.service,
  {
    SendNotification: sendNotification,
  }
);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("❌ gRPC server error:", error);
      return;
    }

    console.log(`🚀 gRPC Notification Service running on port ${port}`);
    server.start();
  }
);