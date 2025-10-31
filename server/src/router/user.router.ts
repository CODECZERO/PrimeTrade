import { Router } from 'express';
import { getAllUsers, getUserById, deleteUser } from '../controller/user.controller.js';
import { verifyData, verifyAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyData);
router.use(verifyAdmin);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).delete(deleteUser);

export default router;
