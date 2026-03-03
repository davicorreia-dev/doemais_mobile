import express from 'express';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';

const app = express();
app.use(express.json());

const rotasPublicas = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout'
];

app.use((req, res, next) => {
  if (rotasPublicas.includes(req.path)) {
    return next();
  }
  
  return authMiddleware(req, res, next);
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

export default app;