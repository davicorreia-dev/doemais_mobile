import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors';

export const integrationAuth = (req: Request, _res: Response, next: NextFunction) => {
  const key = req.header('x-hemocentro-service-key');
  if (!process.env.HEMOCENTRO_SERVICE_API_KEY || key !== process.env.HEMOCENTRO_SERVICE_API_KEY) {
    return next(new UnauthorizedError('Credencial de integração inválida.'));
  }
  next();
};
