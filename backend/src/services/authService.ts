import { hashPassword, comparePassword } from '../utils/password';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto } from '../dtos/doador.dto';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import prisma from '../config/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export const registerDoador = async (doadorData: RegisterDoadorDto) => {
  const { email, cpf, senha, ...rest } = doadorData;

  const existingDoador = await prisma.doador.findFirst({
    where: {
      OR: [
        { email },
        { cpf }
      ]
    }
  });
  
  if (existingDoador) {
    throw new ConflictError('Usuário com este e-mail ou CPF já existe.');
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
      criado_em: true
    }
  });

  return newDoador;
};

export const loginDoador = async (loginData: LoginDoadorDto) => {
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

  const accessTokenSecret = process.env.JWT_SECRET;
  if (!accessTokenSecret) {
    throw new Error('Chave do Access Token não configurada (JWT_SECRET).');
  }
  
  const payload = { doadorId: doador.id };
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  
  const options: SignOptions = {
    expiresIn: expiresIn as any
  };

  const accessToken = jwt.sign(payload, accessTokenSecret, options);

  const refreshToken = randomBytes(64).toString('hex');
  const expirationDays = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || '7', 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt: expiresAt,
      doadorId: doador.id,
    },
  });

  return {
    accessToken,
    refreshToken,
    doador: {
      id: doador.id,
      nome: doador.nome,
      email: doador.email,
    }
  };
};

export const refreshAccessToken = async (tokenData: RefreshTokenDto) => {
  const { refreshToken } = tokenData;

  const savedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { doador: true },
  });

  if (!savedToken) {
    throw new UnauthorizedError('Refresh token inválido.');
  }

  if (new Date() > savedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: savedToken.id } });
    throw new UnauthorizedError('Refresh token expirado.');
  }

  const accessTokenSecret = process.env.JWT_SECRET;
  if (!accessTokenSecret) {
    throw new Error('Chave do Access Token não configurada (JWT_SECRET).');
  }

  const payload = { doadorId: savedToken.doadorId };
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

  const options: SignOptions = {
    expiresIn: expiresIn as any
  };

  const newAccessToken = jwt.sign(payload, accessTokenSecret, options);

  return {
    accessToken: newAccessToken,
  };
};

export const logout = async (tokenData: RefreshTokenDto) => {
  const { refreshToken } = tokenData;

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  return { message: 'Logout realizado com sucesso.' };
};