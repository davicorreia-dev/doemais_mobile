import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';


interface JwtPayload {
  doadorId: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Pega o cabeçalho de autorização
  const authHeader = req.headers.authorization;

  // Verifica se o formato está correto 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de acesso não fornecido ou mal formatado.'));
  }

  // Separa o "Bearer" do token real
  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    
    if (!secret) {
      throw new Error('Chave do Access Token não configurada.');
    }

    // Verifica se o token é válido e não expirou
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Injeta o ID do doador na requisição para ser usado nos próximos controllers
    req.doadorId = decoded.doadorId;

    next();
  } catch (error) {
    return next(new UnauthorizedError('Token inválido ou expirado.'));
  }
};