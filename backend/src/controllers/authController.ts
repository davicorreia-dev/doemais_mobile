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
import env from '../config/environment';

const REFRESH_COOKIE = 'doemais_refresh';
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: Number(env.REFRESH_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000,
};
const isWebClient = (req: Request) => req.get('x-client-platform') === 'web';

function formatAuthResult(req: Request, res: Response, result: Awaited<ReturnType<typeof loginDoador>>) {
  if (!isWebClient(req)) return result;
  if (result.refreshToken) res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions);
  const { refreshToken: _refreshToken, ...webResult } = result;
  return webResult;
}

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
      formatAuthResult(req, res, result),
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
      formatAuthResult(req, res, result),
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
    const refreshToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE];
    const result = await refreshAccessToken({ refreshToken });

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
    const refreshToken = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE];
    const result = await logout({ refreshToken });
    if (isWebClient(req)) res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);

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

