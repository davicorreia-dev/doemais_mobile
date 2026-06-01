export const CONSTANTS = {
  // Validações de Doador
  DONOR: {
    MIN_AGE: 18,
    MAX_AGE: 69,
    MIN_WEIGHT_KG: 50,
    MAX_WEIGHT_KG: 150,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    BLOOD_TYPES: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    GENDERS: ['M', 'F', 'Outro'],
  },

  JWT: {
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_EXPIRES_IN_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || '7', 10),
  },

  API: {
    VERSION: '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
  },

  // Rotas públicas (não requerem autenticação)
  PUBLIC_ROUTES: [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/health',
    '/api/docs',
  ],

  // Roles (para expansão futura)
  ROLES: {
    DONOR: 'donor',
    ADMIN: 'admin',
    HEMOCENTRO: 'hemocentro',
  },
};

export default CONSTANTS;
