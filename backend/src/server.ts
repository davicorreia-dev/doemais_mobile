import 'reflect-metadata';
import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados e inicia o servidor
prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });