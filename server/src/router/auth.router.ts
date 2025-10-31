import { Router } from 'express';
import { signup, login, getMe, logout } from '../controller/auth.controller.js';
import { verifyData } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../middleware/validator.middleware.js';

const router = Router();

router.route("/signup").post(registerValidation, signup);
router.route("/login").post(loginValidation, login);
router.route("/me").get(verifyData, getMe);
router.route("/logout").post(verifyData, logout);

export default router;
