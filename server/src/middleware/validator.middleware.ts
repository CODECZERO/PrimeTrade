import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../util/apiError.js';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.type === 'field' ? (err as any).path : 'unknown',
            message: err.msg
        }));
        throw new ApiError(400, "Validation failed", errorMessages);
    }

    next();
};

const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    handleValidationErrors
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

const createTaskValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title must not exceed 200 characters'),

    body('description')
        .optional()
        .trim(),

    body('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Invalid status value'),

    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
        .withMessage('Invalid priority value'),

    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),

    handleValidationErrors
];

export { registerValidation, loginValidation, createTaskValidation, handleValidationErrors };
