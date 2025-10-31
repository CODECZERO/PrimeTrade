import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../util/apiError.js';
import { verifyAccToken } from '../util/jwtOp.util.js';
import AsyncHandler from '../util/asyncHandler.js';

interface RequestWithUser extends Request {
    user?: any;
}

const verifyData = AsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = verifyAccToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

const verifyAdmin = AsyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, "Access forbidden. Admin only.");
    }

    next();
});

export { verifyData, verifyAdmin };
