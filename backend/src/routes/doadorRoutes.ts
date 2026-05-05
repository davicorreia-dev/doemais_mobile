import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/doadorController';
import validationMiddleware from '../middlewares/validation.middleware';
import { UpdateDoadorDto } from '../dtos/doador.dto';

const router = Router();

// Como o middleware é global, a rota já está protegida
router.get('/me', getProfile);

// Rota PUT para atualizar as informações do usuário
router.put('/me', validationMiddleware(UpdateDoadorDto), updateProfile);

export default router;