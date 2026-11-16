import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import doadorRoutes from './routes/doadorRoutes';
import formularioElegibilidadeRoutes from './routes/formularioElegibilidadeRoutes';
import { authMiddleware } from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import CONSTANTS from './config/constants';
import env from './config/environment';
import { ForbiddenError } from './utils/errors';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
// Body parser com limite aumentado para uploads futuros
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// CORS configurado para mobile e web
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const configuredOrigins = env.CORS_ORIGIN.split(',').map((value) => value.trim()).filter(Boolean);
    const developmentOrigins = [
      'http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080',
      'http://localhost:8081', 'http://localhost:8082', 'http://127.0.0.1:8081',
      'http://127.0.0.1:8082',
    ];
    const allowedOrigins = env.NODE_ENV === 'production' ? configuredOrigins : [...developmentOrigins, ...configuredOrigins];
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new ForbiddenError('Origem não permitida pelo CORS.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas. Tente novamente mais tarde.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Limite de requisições excedido. Tente novamente mais tarde.' },
});

app.use('/api', apiLimiter);

// Health check endpoint (público)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
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
app.use('/api/auth', authLimiter, authRoutes);

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
