import { hashPassword, comparePassword } from '../utils/password';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/errors';
import prisma from '../config/prisma';
import env from '../config/environment';
import CONSTANTS from '../config/constants';
import { AuthResponse, DoadorResponse } from '../types/index';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';
import Logger from '../utils/logger';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

const hashResetToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const registerDoador = async (
  doadorData: RegisterDoadorDto
): Promise<AuthResponse> => {
  const { email, cpf, senha, ...rest } = doadorData;

  const existingDoador = await prisma.doador.findFirst({
    where: {
      OR: [{ email }, { cpf }],
    },
  });

  if (existingDoador) {
    if (existingDoador.email === email) {
      throw new ConflictError('Este e-mail já está registrado.');
    }
    if (existingDoador.cpf === cpf) {
      throw new ConflictError('Este CPF já está registrado.');
    }
  }

  const hashedPassword = await hashPassword(senha);

  const newDoador = await prisma.doador.create({
    data: {
      email,
      cpf,
      senha: hashedPassword,
      ...rest,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      cidade: true,
      cep: true,
      tipo_sanguineo: true,
      criado_em: true,
      genero: true // Mantido do nosso código
    },
  });

  // Mantive a segurança no login
  const accessTokenSecret = process.env.JWT_SECRET || env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error('Chave do Access Token não configurada.');
  }

  // Gera Access Token (Nova funcionalidade da main)
  const payload = { doadorId: newDoador.id };
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  } as any);

  // Gera Refresh Token
  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + CONSTANTS.JWT.REFRESH_EXPIRES_IN_DAYS
  );

  // Cria novo refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt,
      doadorId: newDoador.id,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
    doador: newDoador as unknown as DoadorResponse,
  };
};

export const loginDoador = async (
  loginData: LoginDoadorDto
): Promise<AuthResponse> => {
  const { email, senha } = loginData;

  const doador = await prisma.doador.findUnique({
    where: { email },
  });

  if (!doador) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  const isPasswordValid = await comparePassword(senha, doador.senha);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  const accessTokenSecret = process.env.JWT_SECRET || env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error('Chave do Access Token não configurada.');
  }

  const payload = { doadorId: doador.id };
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  } as any);

  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + CONSTANTS.JWT.REFRESH_EXPIRES_IN_DAYS
  );

  await prisma.refreshToken.deleteMany({
    where: { doadorId: doador.id },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt,
      doadorId: doador.id,
    },
  });

  const doadorResponse: DoadorResponse = {
    id: doador.id,
    nome: doador.nome,
    email: doador.email,
    cpf: doador.cpf,
    telefone: doador.telefone,
    cidade: doador.cidade,
    cep: doador.cep,
    tipo_sanguineo: doador.tipo_sanguineo,
    criado_em: doador.criado_em,
    genero: doador.genero, // Adicionado para a nossa triagem funcionar
  } as unknown as DoadorResponse;

  return {
    accessToken,
    refreshToken,
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
    doador: doadorResponse,
  };
};

export const refreshAccessToken = async (
  tokenData: RefreshTokenDto
): Promise<{ accessToken: string; expiresIn: string }> => {
  const { refreshToken } = tokenData;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token é obrigatório.');
  }

  const savedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!savedToken) {
    throw new UnauthorizedError('Refresh token inválido ou não encontrado.');
  }

  if (new Date() > savedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: savedToken.id } });
    throw new UnauthorizedError('Refresh token expirado.');
  }

  const accessTokenSecret = process.env.JWT_SECRET || env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error('Chave do Access Token não configurada.');
  }

  const payload = { doadorId: savedToken.doadorId };
  const newAccessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  } as any);

  return {
    accessToken: newAccessToken,
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  };
};

export const logout = async (
  tokenData: RefreshTokenDto
): Promise<{ message: string }> => {
  const { refreshToken } = tokenData;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token é obrigatório.');
  }

  const result = await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  if (result.count === 0) {
    throw new UnauthorizedError('Refresh token não encontrado ou já revogado.');
  }

  return { message: 'Logout realizado com sucesso.' };
};

export const requestPasswordReset = async (
  resetData: PasswordResetRequestDto
): Promise<void> => {
  const doador = await prisma.doador.findUnique({ where: { email: resetData.email } });

  // A resposta do endpoint é a mesma para e-mails existentes e inexistentes.
  if (!doador) return;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { doadorId: doador.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: { doadorId: doador.id, tokenHash: hashResetToken(token), expiresAt },
    }),
  ]);

  // A integração de e-mail será adicionada aqui. Nunca registre o token em produção.
  if (env.NODE_ENV !== 'production') {
    const resetUrl = `${env.FRONTEND_URL.replace(/\/$/, '')}/password-reset?token=${encodeURIComponent(token)}`;
    Logger.info('AUTH', 'Link de redefinição de senha (somente desenvolvimento)', { resetUrl });
  }
};

export const confirmPasswordReset = async (
  resetData: PasswordResetConfirmDto
): Promise<void> => {
  const tokenHash = hashResetToken(resetData.token);

  await prisma.$transaction(async (tx) => {
    const resetToken = await tx.passwordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    });

    if (!resetToken) {
      throw new BadRequestError('Este link de redefinição é inválido ou expirou.');
    }

    await tx.doador.update({
      where: { id: resetToken.doadorId },
      data: { senha: await hashPassword(resetData.senha) },
    });
    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });
    await tx.refreshToken.deleteMany({ where: { doadorId: resetToken.doadorId } });
  });
};
