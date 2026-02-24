import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors'; 
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => { 
  console.error(err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  // Para erros não tratados ou erros padrão do JavaScript
  res.status(500).json({
    message: 'Erro interno do servidor.',
    errorName: err.name,
  });
};
export default errorMiddleware;
