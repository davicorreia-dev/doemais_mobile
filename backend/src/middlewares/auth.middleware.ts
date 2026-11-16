import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { JwtPayload } from '../types/index';
import { verifyAccessToken } from '../utils/tokens';

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
    const decoded = verifyAccessToken(token) as JwtPayload;

    req.doadorId = decoded.doadorId;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token de acesso expirado.'));
    }
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Token de acesso inválido.'));
    }
    return next(new UnauthorizedError('Erro ao validar token.'));
  }
};
