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
  // Pega o cabeçalho de autorização
  const authHeader = req.headers.authorization;

  // Verifica se o formato está correto (Bearer <token>)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new UnauthorizedError('Token de acesso não fornecido ou mal formatado.')
    );
  }

  // Separa o "Bearer" do token real
  const token = authHeader.split(' ')[1];

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Injeta o ID do doador na requisição para uso posterior
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