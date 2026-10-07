FROM node:24-alpine

WORKDIR /app

COPY services/order-service/package*.json ./

RUN npm install

COPY services/order-service/tsconfig.json ./
COPY services/order-service/src ./src
COPY proto ./proto

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]