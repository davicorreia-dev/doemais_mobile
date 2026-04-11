import { Router } from 'express';
import { getProfile } from '../controllers/doadorController';

const router = Router();

// Como o middleware é global, não precisamos passar nada aqui.
// Esta rota já nasce protegida!
router.get('/me', getProfile);

export default router;