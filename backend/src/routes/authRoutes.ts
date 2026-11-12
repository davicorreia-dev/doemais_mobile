import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, refresh, logoutUser, requestPasswordResetController, confirmPasswordResetController } from '../controllers/authController';
import validationMiddleware from '../middlewares/validation.middleware';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';

const router = Router();

const createLimiter = (windowMs: number, max: number) => rateLimit({
  windowMs,
  max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas. Aguarde e tente novamente.' },
});

const loginLimiter = createLimiter(15 * 60 * 1000, 5);
const registerLimiter = createLimiter(60 * 60 * 1000, 3);
const resetRequestLimiter = createLimiter(15 * 60 * 1000, 3);
const resetConfirmLimiter = createLimiter(15 * 60 * 1000, 5);
const refreshLimiter = createLimiter(15 * 60 * 1000, 30);
const logoutLimiter = createLimiter(15 * 60 * 1000, 10);

router.post('/register', registerLimiter, validationMiddleware(RegisterDoadorDto), register);
router.post('/login', loginLimiter, validationMiddleware(LoginDoadorDto), login);
router.post('/refresh', refreshLimiter, refresh);
router.post('/logout', logoutLimiter, logoutUser);
router.post('/password-reset/request', resetRequestLimiter, validationMiddleware(PasswordResetRequestDto), requestPasswordResetController);
router.post('/password-reset/confirm', resetConfirmLimiter, validationMiddleware(PasswordResetConfirmDto), confirmPasswordResetController);

export default router;
