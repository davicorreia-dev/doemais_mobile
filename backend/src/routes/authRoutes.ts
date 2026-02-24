import { Router } from 'express';
import { register, login, refresh, logoutUser } from '../controllers/authController';
import validationMiddleware from '../middlewares/validation.middleware';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto } from '../dtos/doador.dto';

const router = Router();

router.post('/register', validationMiddleware(RegisterDoadorDto), register);
router.post('/login', validationMiddleware(LoginDoadorDto), login);
router.post('/refresh', validationMiddleware(RefreshTokenDto), refresh);
router.post('/logout', validationMiddleware(RefreshTokenDto), logoutUser);

export default router;