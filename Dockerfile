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

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server/index.js"]