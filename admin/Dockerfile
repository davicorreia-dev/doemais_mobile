FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 5174 = painel admin (Vite)
EXPOSE 5174

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5174"]
