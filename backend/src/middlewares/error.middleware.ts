import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro:', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Erro customizado da aplicação
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      error: err.name,
    });
  }



  // Erro padrão do JavaScript ou desconhecido
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
    statusCode: 500,
    error: err.name || 'UnknownError',
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
    }),
  });
};

export default errorMiddleware;
