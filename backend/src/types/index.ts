export interface JwtPayload {
  doadorId: number;
  iat?: number;
  exp?: number;
}

export interface DoadorResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string | null;
  cidade?: string | null;
  cep?: string | null;
  tipo_sanguineo?: string | null;
  criado_em: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  doador: DoadorResponse;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

// Extensão de Request do Express para injetar dados de autenticação
declare global {
  namespace Express {
    interface Request {
      doadorId?: number;
      user?: {
        id: number;
      };
    }
  }
}
