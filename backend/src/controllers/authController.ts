import { Request, Response, NextFunction } from 'express';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';
import {
  registerDoador,
  loginDoador,
  refreshAccessToken,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
} from '../services/authService';
import ApiResponseHandler from '../utils/response';
import { clearRefreshCookie, getRefreshCookie, isBrowserRequest, setRefreshCookie } from '../utils/refreshCookie';

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

    if (isBrowserRequest(req)) {
      setRefreshCookie(res, result.refreshToken);
      const { refreshToken: _refreshToken, ...browserResult } = result;
      ApiResponseHandler.success(res, 'Login realizado com sucesso.', browserResult, 200);
      return;
    }

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
    const tokenData: RefreshTokenDto = {
      ...(req.body ?? {}),
      refreshToken: req.body?.refreshToken || getRefreshCookie(req),
    };
    const result = await refreshAccessToken(tokenData);

    if (isBrowserRequest(req)) {
      setRefreshCookie(res, result.refreshToken);
      const { refreshToken: _refreshToken, ...browserResult } = result;
      ApiResponseHandler.success(res, 'Token renovado com sucesso.', browserResult, 200);
      return;
    }

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
    const tokenData: RefreshTokenDto = {
      ...(req.body ?? {}),
      refreshToken: req.body?.refreshToken || getRefreshCookie(req),
    };

    if (!tokenData.refreshToken && isBrowserRequest(req)) {
      clearRefreshCookie(res);
      ApiResponseHandler.success(res, 'Logout realizado com sucesso.', null, 200);
      return;
    }

    const result = await logout(tokenData);
    if (isBrowserRequest(req)) clearRefreshCookie(res);

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

