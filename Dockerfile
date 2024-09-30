FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

WORKDIR /app

EXPOSE 3000

CMD ["node", "server/index.js"]