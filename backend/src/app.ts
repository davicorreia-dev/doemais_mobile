import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import doadorRoutes from './routes/doadorRoutes';
import formularioElegibilidadeRoutes from './routes/formularioElegibilidadeRoutes';
import { authMiddleware } from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import CONSTANTS from './config/constants';
import env from './config/environment';

const app = express();

// Body parser com limite aumentado para uploads futuros
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configurado para mobile e web
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8080',
    env.CORS_ORIGIN,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Health check endpoint (público)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Middleware de autenticação com whitelist de rotas públicas
app.use((req, res, next) => {
  // Verifica se a rota é pública
  const isPublicRoute = CONSTANTS.PUBLIC_ROUTES.some(
    (route) => req.path === route || req.path.startsWith(route)
  );

  // Se for rota pública, passa direto
  if (isPublicRoute) {
    return next();
  }

  // Caso contrário, aplica autenticação
  return authMiddleware(req, res, next);
});

// Rotas de autenticação (públicas)
app.use('/api/auth', authRoutes);

// Rotas de doador (protegidas)
app.use('/api/doadores', doadorRoutes);

// Rotas de formulário de elegibilidade (protegidas)
app.use('/api/doadores', formularioElegibilidadeRoutes);

// Rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.path}`,
    statusCode: 404,
  });
});

app.use(errorMiddleware);

export default app;