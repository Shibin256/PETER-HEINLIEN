import { body } from 'express-validator';

export const validateUsernameChange = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must contain only letters'),
]