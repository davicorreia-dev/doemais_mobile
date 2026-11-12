import { Request, Response, NextFunction } from 'express';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';
import {
  registerDoador,
  loginDoador,
  refreshAccessToken,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  isEmailAvailable,
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
    const result = await registerDoador(doadorData);

    ApiResponseHandler.success(
      res,
      'Doador registrado com sucesso.',
      result,
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

export const requestPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestPasswordReset(req.body as PasswordResetRequestDto);
    ApiResponseHandler.success(res, 'Se houver uma conta com este e-mail, enviaremos as instruções de redefinição.', null, 200);
  } catch (error) {
    next(error);
  }
};

export const confirmPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await confirmPasswordReset(req.body as PasswordResetConfirmDto);
    ApiResponseHandler.success(res, 'Senha redefinida com sucesso.', null, 200);
  } catch (error) {
    next(error);
  }
};

export const checkEmailAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as PasswordResetRequestDto;
    const available = await isEmailAvailable(email);
    ApiResponseHandler.success(res, 'Disponibilidade de e-mail consultada.', { available }, 200);
  } catch (error) {
    next(error);
  }
};
