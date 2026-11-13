import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

const changes = (before: Record<string, unknown>, after: Record<string, unknown>) =>
  Object.keys({ ...before, ...after }).filter((key) => before[key] !== after[key]);

export const create = async (doadorId: number, data: any) => {
  const pending = await prisma.solicitacao_Correcao.findFirst({ where: { doador_id: doadorId, modulo: data.modulo, status: 'PENDING_REVIEW' } });
  if (pending) throw new BadRequestError('Já existe uma solicitação de correção pendente para este formulário.');
  return prisma.solicitacao_Correcao.create({ data: { doador_id: doadorId, ...data } });
};
export const finish = async (doadorId: number, id: number, answers: Record<string, unknown>) => {
  const request = await prisma.solicitacao_Correcao.findFirst({ where: { id, doador_id: doadorId, status: 'PENDING_REVIEW' } });
  if (!request) throw new UnauthorizedError('Solicitação de correção não encontrada.');
  const changed = changes(request.respostas_originais as Record<string, unknown>, answers);
  return prisma.solicitacao_Correcao.update({ where: { id }, data: { respostas_corrigidas: answers as Prisma.InputJsonObject, perguntas_alteradas: changed } });
};
export const latestForDoador = (doadorId: number) => prisma.solicitacao_Correcao.findMany({ where: { doador_id: doadorId }, orderBy: { criado_em: 'desc' } });
export const pendingForIntegration = async () => {
  const requests = await prisma.solicitacao_Correcao.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: { doador: { select: { id: true, nome: true, tipo_sanguineo: true } } },
    orderBy: { criado_em: 'asc' },
  });
  return requests.map((request) => ({
    ...request,
    reteste_solicitado: true,
  }));
};
export const resolve = (id: number, data: any) => prisma.solicitacao_Correcao.update({ where: { id }, data: { status: data.status, responsavel: data.responsavel, observacao_resolucao: data.observacao, resolvido_em: new Date() } });
