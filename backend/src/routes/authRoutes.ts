import { NextFunction, Request, Response, Router } from 'express';
import { register, login, refresh, logoutUser, requestPasswordResetController, confirmPasswordResetController, checkEmailAvailability } from '../controllers/authController';
import validationMiddleware from '../middlewares/validation.middleware';
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetConfirmDto } from '../dtos/doador.dto';

const router = Router();

const emailAvailabilityAttempts = new Map<string, { count: number; resetAt: number }>();

function limitEmailAvailability(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const existing = emailAvailabilityAttempts.get(key);
  const attempt = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + 60_000 }
    : existing;

  attempt.count += 1;
  emailAvailabilityAttempts.set(key, attempt);

  if (attempt.count > 5) {
    return res.status(429).json({ success: false, message: 'Muitas tentativas. Aguarde um minuto e tente novamente.' });
  }

  next();
}

router.post('/register', validationMiddleware(RegisterDoadorDto), register);
router.post('/login', validationMiddleware(LoginDoadorDto), login);
router.post('/refresh', validationMiddleware(RefreshTokenDto), refresh);
router.post('/logout', validationMiddleware(RefreshTokenDto), logoutUser);
router.post('/password-reset/request', validationMiddleware(PasswordResetRequestDto), requestPasswordResetController);
router.post('/password-reset/confirm', validationMiddleware(PasswordResetConfirmDto), confirmPasswordResetController);
router.post('/email-availability', limitEmailAvailability, validationMiddleware(PasswordResetRequestDto), checkEmailAvailability);

export default router;
