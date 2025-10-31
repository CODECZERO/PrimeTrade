import { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError.js';

const AsyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error: any) => {
                console.error(error);

                if (error instanceof ApiError) {
                    return next(error);
                }

                const apiError = new ApiError(500, 'Internal Server Error');
                next(apiError);
            });
    };
};

export default AsyncHandler;
