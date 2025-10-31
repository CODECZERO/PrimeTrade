import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRouter from './router/auth.router.js';
import taskRouter from './router/task.router.js';
import userRouter from './router/user.router.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    keyGenerator: (req: express.Request): string => req.ip as string
});

app.use(limiter);
app.set('trust proxy', 1);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        statusCode,
        data: message,
        success: false,
        errors: err.errors || []
    });
});

export default app;
