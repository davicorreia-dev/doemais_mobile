import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import env from '../config/environment';
import CONSTANTS from '../config/constants';

const JWT_ISSUER = 'doemais-api';
const JWT_AUDIENCE = 'doemais-client';

export const hashOpaqueToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const createRefreshToken = (): string => randomBytes(64).toString('hex');

export const issueAccessToken = (doadorId: number): string =>
  jwt.sign({ doadorId }, env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  } as jwt.SignOptions);

export const verifyAccessToken = (token: string): jwt.JwtPayload =>
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
    algorithms: ['HS256'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  }) as jwt.JwtPayload;
