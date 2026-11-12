import prisma from '../config/prisma';
import { CreateTriagemResultadoDto } from '../dtos/doador.dto';
import { UnauthorizedError } from '../utils/errors';

const ensureDoador = async (doadorId: number) => {
  const doador = await prisma.doador.findUnique({ where: { id: doadorId }, select: { id: true } });
  if (!doador) throw new UnauthorizedError('Usuário não encontrado.');
};

export const createTriagemResultado = async (doadorId: number, data: CreateTriagemResultadoDto) => {
  await ensureDoador(doadorId);
  return prisma.triagem_Resultado.create({
    data: {
      doador_id: doadorId,
      modulo: data.modulo,
      status: data.status,
      respostas: data.respostas,
    },
  });
};

export const getLatestTriagens = async (doadorId: number) => {
  await ensureDoador(doadorId);
  const results = await prisma.triagem_Resultado.findMany({
    where: { doador_id: doadorId },
    orderBy: { data_preenchimento: 'desc' },
  });

  return results.reduce<Record<string, typeof results[number]>>((latest, result) => {
    if (!latest[result.modulo]) latest[result.modulo] = result;
    return latest;
  }, {});
};

export const resetTriagens = async (doadorId: number) => {
  await ensureDoador(doadorId);
  const result = await prisma.triagem_Resultado.deleteMany({ where: { doador_id: doadorId } });
  return { deleted: result.count };
};
