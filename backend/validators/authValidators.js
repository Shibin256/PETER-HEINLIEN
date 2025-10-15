import { body } from 'express-validator';

export const validateUserRegistration = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must contain only letters'),

    body('email')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?!.*\s).{6,}$/)
        .withMessage('Password must be at least 6 chars, with uppercase, lowercase, number, special char, no spaces'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    body('phone')
        .optional({ checkFalsy: true }) 
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Phone must be a valid Indian number'),
];
