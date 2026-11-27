import { Request, Response } from 'express';
import env from '../config/environment';

export const REFRESH_COOKIE_NAME = 'doemais_refresh';

const refreshMaxAge = () => parseInt(env.REFRESH_TOKEN_EXPIRATION_DAYS, 10) * 24 * 60 * 60 * 1000;

export const isBrowserRequest = (request: Request) => Boolean(request.headers.origin);

export const getRefreshCookie = (request: Request): string | undefined => {
  const rawCookie = request.headers.cookie;
  if (!rawCookie) return undefined;
  const cookie = rawCookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${REFRESH_COOKIE_NAME}=`));
  return cookie ? decodeURIComponent(cookie.slice(REFRESH_COOKIE_NAME.length + 1)) : undefined;
};

export const setRefreshCookie = (response: Response, token: string) => {
  const secure = env.NODE_ENV === 'production';
  const sameSite = secure ? 'None' : 'Lax';
  const cookie = [
    `${REFRESH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/api/auth',
    `Max-Age=${Math.floor(refreshMaxAge() / 1000)}`,
    `SameSite=${sameSite}`,
    secure ? 'Secure' : '',
  ].filter(Boolean).join('; ');
  response.setHeader('Set-Cookie', cookie);
};

export const clearRefreshCookie = (response: Response) => {
  const secure = env.NODE_ENV === 'production';
  const sameSite = secure ? 'None' : 'Lax';
  const cookie = [
    `${REFRESH_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/api/auth',
    'Max-Age=0',
    `SameSite=${sameSite}`,
    secure ? 'Secure' : '',
  ].filter(Boolean).join('; ');
  response.setHeader('Set-Cookie', cookie);
};
