import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, updateUserSchema } from '../validation/auth.js';
import {
  getCurrentUserController,
  registerUserController,
  updateUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUserSessionController),
);
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/update',
  authenticate,
  uploadMiddleware,
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

export default router;
