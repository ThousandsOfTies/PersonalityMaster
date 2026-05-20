FROM node:20-slim

WORKDIR /usr/src/app

# Install production dependencies only.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3003

CMD ["node", "server/index.js"]
