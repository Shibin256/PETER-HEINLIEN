import { body } from 'express-validator';

export const validateCoupon = [
    body('couponCode')
        .trim()
        .notEmpty().withMessage('Coupon code is required')
        .isLength({ min: 3, max: 20 }).withMessage('Coupon code must be between 3 and 20 characters')
        .matches(/^[A-Za-z0-9_-]+$/).withMessage('Coupon code can only contain letters, numbers, underscores, and hyphens'),

    body('discountType')
        .notEmpty().withMessage('Discount type is required')
        .isIn(['fixed', 'percentage']).withMessage('Discount type must be either "fixed" or "percentage"'),

    body('discountAmount')
        .notEmpty().withMessage('Discount amount is required')
        .isFloat({ gt: 0 }).withMessage('Discount amount must be greater than 0'),

    body('minPurchase')
        .notEmpty().withMessage('Minimum purchase is required')
        .isFloat({ gt: 0 }).withMessage('Minimum purchase must be greater than 0'),

    body('usageLimit')
        .notEmpty().withMessage('Usage limit is required')
        .isInt({ gt: 0 }).withMessage('Usage limit must be a positive integer'),

    body('expirationDate')
        .notEmpty().withMessage('Expiration date is required')
        .isISO8601().withMessage('Invalid date format')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
];
