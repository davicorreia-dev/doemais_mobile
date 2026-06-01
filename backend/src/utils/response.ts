/**
 * Handler de respostas padrão da API
 * Garante consistência em todas as respostas
 */

import { Response } from 'express';
import { ApiResponse } from '../types/index';

export class ApiResponseHandler {
  /**
   * Envia uma resposta de sucesso
   */
  static success<T = any>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Envia uma resposta de erro
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: error || message,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Envia uma resposta de sucesso com paginação (para futuro)
   */
  static paginated<T = any>(
    res: Response,
    message: string,
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    statusCode: number = 200
  ): Response {
    const response: any = {
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      statusCode,
    };
    return res.status(statusCode).json(response);
  }
}

export default ApiResponseHandler;
