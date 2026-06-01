import 'reflect-metadata';
import app from './app';
import env from './config/environment';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = env.PORT;

async function startServer() {
  try {
    // Conecta ao banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida.');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Trata desligamento gracioso
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido. Desligando graciosamente...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido. Desligando graciosamente...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();