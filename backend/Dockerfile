FROM node:22-slim

# Prisma precisa do OpenSSL
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000

# Aplica as migrations e sobe a API
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
