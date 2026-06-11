import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/environment';
import { UnauthorizedError } from '../utils/errors';
import { JwtPayload } from '../types/index';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new UnauthorizedError('Token de acesso não fornecido ou mal formatado.')
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Tenta usar a variável corrigida, com fallback para o novo padrão da main
    const secret = process.env.JWT_SECRET || env.ACCESS_TOKEN_SECRET;
    
    if (!secret) {
      throw new Error('Chave do Access Token não configurada.');
    }

    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.doadorId = decoded.doadorId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token de acesso expirado.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Token de acesso inválido.'));
    }
    return next(new UnauthorizedError('Erro ao validar token.'));
  }
};