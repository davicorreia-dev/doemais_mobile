import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';
import { ValidationError } from 'class-validator';

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

  // Erro de validação do class-validator
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const validationErrors: Record<string, string[]> = {};
    
    err.forEach((error: ValidationError) => {
      if (error.constraints) {
        validationErrors[error.property] = Object.values(error.constraints);
      }
    });

    return res.status(400).json({
      success: false,
      message: 'Erro de validação.',
      statusCode: 400,
      error: 'ValidationError',
      details: validationErrors,
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
