#!/bin/bash
set -e

echo "🔨 Iniciando build da aplicação..."

# Install dependencies
echo "📦 Instalando dependências..."
npm install

# Generate Prisma Client
echo "🗄️  Gerando Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Executando migrações do banco de dados..."
npx prisma migrate deploy

# Build TypeScript
echo "📝 Compilando TypeScript..."
npm run build

echo "✅ Build concluído com sucesso!"
