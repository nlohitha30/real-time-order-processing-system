import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../proto/notification.proto"
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

const client = new notificationProto.notification.NotificationService(
  "notification-service:50051",
  grpc.credentials.createInsecure()
);

export const sendNotification = (order: {
  orderId: string;
  customerId: string;
  product: string;
  quantity: number;
  status: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.SendNotification(order, (error: any, response: any) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(response);
    });
  });
};