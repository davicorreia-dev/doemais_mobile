import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentConfig {
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRATION_SECONDS: string;
  REFRESH_TOKEN_EXPIRATION_DAYS: string;
  PORT: string;
  NODE_ENV: string;
  CORS_ORIGIN: string;
  FRONTEND_URL: string;
  HEMOCENTRO_SERVICE_API_KEY?: string;
}

function validateEnvironment(): EnvironmentConfig {
  const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente ausentes: ${missingEnvVars.join(', ')}`
    );
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRATION_SECONDS:
      process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || '7d',
    REFRESH_TOKEN_EXPIRATION_DAYS:
      process.env.REFRESH_TOKEN_EXPIRATION_DAYS || '7',
    PORT: process.env.PORT || '3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8081',
    HEMOCENTRO_SERVICE_API_KEY: process.env.HEMOCENTRO_SERVICE_API_KEY,
  };
}

export const env = validateEnvironment();

export default env;
