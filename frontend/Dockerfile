FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# 8081 = Metro / Expo Go
EXPOSE 8081

# HOST_IP e EXPO_PUBLIC_API_URL vêm do docker-compose
CMD ["npx", "expo", "start", "--lan", "--port", "8081"]
