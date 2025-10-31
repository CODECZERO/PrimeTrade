import { Request, Response } from 'express';
import { ApiError } from '../util/apiError.js';
import { ApiResponse } from '../util/apiResponse.js';
import bcrypt from 'bcrypt';
import { genAccToken, genRefToken } from '../util/jwtOp.util.js';
import AsyncHandler from '../util/asyncHandler.js';
import prisma from '../db/prisma.db.js';

interface RequestWithUser extends Request {
    user?: any;
}

const options = {
    httpOnly: true,
    secure: true
};

const tokenGen = async (user: { id: string; email: string; role: string }) => {
    const [accessToken, refreshToken] = await Promise.all([
        genAccToken(user),
        genRefToken(user)
    ]);
    return { accessToken, refreshToken };
};

const signup = AsyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: 'USER'
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true
        }
    });

    const { accessToken, refreshToken } = await tokenGen({
        id: user.id,
        email: user.email,
        role: user.role
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(201, { user, token: accessToken }, "User registered successfully"));
});

const login = AsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await tokenGen({
        id: user.id,
        email: user.email,
        role: user.role
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    const { password: _, ...userData } = user;

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: userData, token: accessToken }, "Login successful"));
});

const getMe = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    // Return user data from JWT token instead of querying database
    // Only query database if we need fresh data (e.g., profile updates)
    const user = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    };

    return res.status(200).json(new ApiResponse(200, { user }, "User profile retrieved successfully"));
});

const logout = AsyncHandler(async (req: RequestWithUser, res: Response) => {
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
    });

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

export { signup, login, getMe, logout };
