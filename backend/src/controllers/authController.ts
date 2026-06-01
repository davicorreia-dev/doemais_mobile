import { Request, Response, NextFunction } from 'express';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto } from '../dtos/doador.dto';
import {
  registerDoador,
  loginDoador,
  refreshAccessToken,
  logout,
} from '../services/authService';
import ApiResponseHandler from '../utils/response';

/**
 * Registra um novo doador
 * 
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doadorData: RegisterDoadorDto = req.body;
    const doador = await registerDoador(doadorData);

    ApiResponseHandler.success(
      res,
      'Doador registrado com sucesso.',
      { doador },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Faz login de um doador
 * 
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginData: LoginDoadorDto = req.body;
    const result = await loginDoador(loginData);

    ApiResponseHandler.success(
      res,
      'Login realizado com sucesso.',
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Renova o Access Token
 * 
 * POST /api/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenData: RefreshTokenDto = req.body;
    const result = await refreshAccessToken(tokenData);

    ApiResponseHandler.success(
      res,
      'Token renovado com sucesso.',
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Faz logout revogando o Refresh Token
 * 
 * POST /api/auth/logout
 */
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenData: RefreshTokenDto = req.body;
    const result = await logout(tokenData);

    ApiResponseHandler.success(
      res,
      result.message,
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};