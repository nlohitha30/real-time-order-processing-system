FROM node:24-alpine

WORKDIR /app

ENV DOCKER_ENV=true

COPY services/notification-service/package*.json ./

RUN npm install

COPY services/notification-service/tsconfig.json ./
COPY services/notification-service/src ./src
COPY proto ./proto

RUN npm run build

EXPOSE 50051

CMD ["node", "dist/grpc-server.js"]