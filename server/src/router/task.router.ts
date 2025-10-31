import { Router } from 'express';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controller/task.controller.js';
import { verifyData } from '../middleware/auth.middleware.js';
import { createTaskValidation } from '../middleware/validator.middleware.js';

const router = Router();

router.use(verifyData);

router.route("/stats").get(getTaskStats);
router.route("/").get(getTasks).post(createTaskValidation, createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
