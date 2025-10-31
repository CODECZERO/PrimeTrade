import { Request, Response } from 'express';
import { ApiError } from '../util/apiError.js';
import { ApiResponse } from '../util/apiResponse.js';
import AsyncHandler from '../util/asyncHandler.js';
import prisma from '../db/prisma.db.js';

interface RequestWithUser extends Request {
    user?: any;
}

const getTasks = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { status, priority, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
    }

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    const [tasks, totalTasks] = await Promise.all([
        prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit as string)
        }),
        prisma.task.count({ where })
    ]);

    const totalPages = Math.ceil(totalTasks / parseInt(limit as string));

    return res.status(200).json(
        new ApiResponse(200, {
            tasks,
            pagination: {
                currentPage: parseInt(page as string),
                totalPages,
                totalTasks,
                limit: parseInt(limit as string)
            }
        }, "Tasks retrieved successfully")
    );
});

const getTaskById = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    const where: any = { id };

    if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
    }

    const task = await prisma.task.findFirst({
        where
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(new ApiResponse(200, { task }, "Task retrieved successfully"));
});

const createTask = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { title, description, status = 'PENDING', priority = 'MEDIUM', dueDate } = req.body;

    const task = await prisma.task.create({
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: req.user.id
        }
    });

    return res.status(201).json(new ApiResponse(201, { task }, "Task created successfully"));
});

const updateTask = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const where: any = { id };

    if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
    }

    const existingTask = await prisma.task.findFirst({ where });

    if (!existingTask) {
        throw new ApiError(404, "Task not found or you do not have permission to update it");
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
        where: { id },
        data: updateData
    });

    return res.status(200).json(new ApiResponse(200, { task }, "Task updated successfully"));
});

const deleteTask = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    const where: any = { id };

    if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
    }

    const task = await prisma.task.findFirst({ where });

    if (!task) {
        throw new ApiError(404, "Task not found or you do not have permission to delete it");
    }

    await prisma.task.delete({ where: { id } });

    return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

const getTaskStats = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const where: any = {};

    if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
    }

    // Fetch all tasks in a single query and calculate stats in memory
    const tasks = await prisma.task.findMany({
        where,
        select: {
            status: true,
            priority: true,
            dueDate: true
        }
    });

    const now = new Date();
    const stats = {
        total_tasks: tasks.length.toString(),
        pending: tasks.filter(t => t.status === 'PENDING').length.toString(),
        in_progress: tasks.filter(t => t.status === 'IN_PROGRESS').length.toString(),
        completed: tasks.filter(t => t.status === 'COMPLETED').length.toString(),
        cancelled: tasks.filter(t => t.status === 'CANCELLED').length.toString(),
        urgent_tasks: tasks.filter(t => t.priority === 'URGENT').length.toString(),
        overdue: tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'COMPLETED').length.toString()
    };

    return res.status(200).json(new ApiResponse(200, { stats }, "Task statistics retrieved successfully"));
});

export { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats };
