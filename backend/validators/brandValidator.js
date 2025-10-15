import { body } from 'express-validator';

export const validateBrand = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Brand name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Brand name can only contain letters, numbers, spaces, and hyphens'),

  body('description')
    .optional()
    .isLength({ max: 200 }).withMessage('Description must not exceed 200 characters'),
];
