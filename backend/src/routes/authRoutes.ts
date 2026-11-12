import { Router } from 'express';
import { register, login, refresh, logoutUser, requestPasswordResetController, confirmPasswordResetController } from '../controllers/authController';
import validationMiddleware from '../middlewares/validation.middleware';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';

const router = Router();

router.post('/register', validationMiddleware(RegisterDoadorDto), register);
router.post('/login', validationMiddleware(LoginDoadorDto), login);
router.post('/refresh', validationMiddleware(RefreshTokenDto), refresh);
router.post('/logout', validationMiddleware(RefreshTokenDto), logoutUser);
router.post('/password-reset/request', validationMiddleware(PasswordResetRequestDto), requestPasswordResetController);
router.post('/password-reset/confirm', validationMiddleware(PasswordResetConfirmDto), confirmPasswordResetController);

export default router;
