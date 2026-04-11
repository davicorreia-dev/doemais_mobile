import prisma from '../config/prisma';
import { UnauthorizedError } from '../utils/errors';

export const getDoadorProfile = async (id: number) => {
  const doador = await prisma.doador.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      tipo_sanguineo: true,
      criado_em: true,
    },
  });

  if (!doador) {
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  return doador;
};