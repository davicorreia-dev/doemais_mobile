import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // ID do doador que virá do token JWT
      doadorId?: number;
    }
  }
}