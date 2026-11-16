import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';

const changes = (before: Record<string, unknown>, after: Record<string, unknown>) =>
  Object.keys({ ...before, ...after }).filter((key) => before[key] !== after[key]);

interface CreateCorrectionData {
  modulo: string;
  motivo: string;
  comentario?: string;
  respostas_originais: Record<string, unknown>;
  contexto_reteste?: Record<string, unknown>;
}

export const create = async (doadorId: number, data: CreateCorrectionData) => {
  const doador = await prisma.doador.findUnique({ where: { id: doadorId }, select: { id: true } });
  if (!doador) throw new UnauthorizedError('Usuário não encontrado.');
  const pending = await prisma.solicitacao_Correcao.findFirst({ where: { doador_id: doadorId, modulo: data.modulo, status: 'PENDING_REVIEW' } });
  if (pending) throw new BadRequestError('Já existe uma solicitação de correção pendente para este formulário.');
  return prisma.solicitacao_Correcao.create({
    data: {
      doador_id: doadorId,
      modulo: data.modulo,
      motivo: data.motivo,
      comentario: data.comentario,
      respostas_originais: data.respostas_originais as Prisma.InputJsonObject,
      contexto_reteste: data.contexto_reteste as Prisma.InputJsonObject | undefined,
    },
  });
};
export const finish = async (doadorId: number, id: number, answers: Record<string, unknown>) => {
  if (!Number.isSafeInteger(id) || id < 1) throw new BadRequestError('Identificador de solicitação inválido.');
  const request = await prisma.solicitacao_Correcao.findFirst({ where: { id, doador_id: doadorId, status: 'PENDING_REVIEW' } });
  if (!request) throw new NotFoundError('Solicitação de correção não encontrada.');
  if (request.respostas_corrigidas !== null) throw new BadRequestError('Esta solicitação de correção já foi finalizada.');
  const changed = changes(request.respostas_originais as Record<string, unknown>, answers);
  return prisma.solicitacao_Correcao.update({ where: { id }, data: { respostas_corrigidas: answers as Prisma.InputJsonObject, perguntas_alteradas: changed } });
};
export const latestForDoador = async (doadorId: number) => {
  const requests = await prisma.solicitacao_Correcao.findMany({ where: { doador_id: doadorId }, orderBy: { criado_em: 'desc' } });
  return requests.map((request) => ({ ...request, data_solicitacao: request.criado_em }));
};
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
export const resolve = async (id: number, data: { status: 'APPROVED' | 'REJECTED'; responsavel: string; observacao?: string }) => {
  if (!Number.isSafeInteger(id) || id < 1) throw new BadRequestError('Identificador de solicitação inválido.');
  const result = await prisma.solicitacao_Correcao.updateMany({
    where: { id, status: 'PENDING_REVIEW' },
    data: { status: data.status, responsavel: data.responsavel, observacao_resolucao: data.observacao, resolvido_em: new Date() },
  });
  if (result.count === 0) throw new NotFoundError('Solicitação pendente de correção não encontrada.');
  return prisma.solicitacao_Correcao.findUniqueOrThrow({ where: { id } });
};
