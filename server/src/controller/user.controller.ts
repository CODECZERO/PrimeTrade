import { Request, Response } from 'express';
import { ApiError } from '../util/apiError.js';
import { ApiResponse } from '../util/apiResponse.js';
import AsyncHandler from '../util/asyncHandler.js';
import prisma from '../db/prisma.db.js';

interface RequestWithUser extends Request {
    user?: any;
}

const getAllUsers = AsyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit as string)
        }),
        prisma.user.count()
    ]);

    const totalPages = Math.ceil(totalUsers / parseInt(limit as string));

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: {
                currentPage: parseInt(page as string),
                totalPages,
                totalUsers,
                limit: parseInt(limit as string)
            }
        }, "Users retrieved successfully")
    );
});

const getUserById = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, { user }, "User retrieved successfully"));
});

const deleteUser = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;

    if (id === req.user.id) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export { getAllUsers, getUserById, deleteUser };
