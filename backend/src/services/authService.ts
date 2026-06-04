import { hashPassword, comparePassword } from '../utils/password';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto } from '../dtos/doador.dto';
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/errors';
import prisma from '../config/prisma';
import env from '../config/environment';
import CONSTANTS from '../config/constants';
import { AuthResponse, DoadorResponse } from '../types/index';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';


export const registerDoador = async (
  doadorData: RegisterDoadorDto
): Promise<AuthResponse> => {
  const { email, cpf, senha, ...rest } = doadorData;

  // Verifica se email ou CPF já existem
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

  // Hash da senha
  const hashedPassword = await hashPassword(senha);

  // Cria novo doador
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
      tipo_sanguineo: true,
      criado_em: true,
    },
  });

  // Gera Access Token
  const payload = { doadorId: newDoador.id };
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
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
    doador: newDoador,
  };
};


export const loginDoador = async (
  loginData: LoginDoadorDto
): Promise<AuthResponse> => {
  const { email, senha } = loginData;

  // Busca doador por email
  const doador = await prisma.doador.findUnique({
    where: { email },
  });

  if (!doador) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  // Valida senha
  const isPasswordValid = await comparePassword(senha, doador.senha);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  // Gera Access Token
  const payload = { doadorId: doador.id };
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  } as any);

  // Gera Refresh Token
  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + CONSTANTS.JWT.REFRESH_EXPIRES_IN_DAYS
  );

  // Revoga todos os refresh tokens anteriores (segurança)
  await prisma.refreshToken.deleteMany({
    where: { doadorId: doador.id },
  });

  // Cria novo refresh token
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
    tipo_sanguineo: doador.tipo_sanguineo,
    criado_em: doador.criado_em,
  };

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

  // Busca o refresh token no banco
  const savedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!savedToken) {
    throw new UnauthorizedError('Refresh token inválido ou não encontrado.');
  }

  // Verifica expiração
  if (new Date() > savedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: savedToken.id } });
    throw new UnauthorizedError('Refresh token expirado.');
  }

  // Gera novo Access Token
  const payload = { doadorId: savedToken.doadorId };
  const newAccessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  } as any);

  return {
    accessToken: newAccessToken,
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  };
};

// Realiza logout revogando o Refresh Token
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