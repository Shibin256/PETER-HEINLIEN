// validators/categoryValidator.js
import { body } from "express-validator";

export const validateCategory = [
  body("category")
    .trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Category name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/).withMessage("Category name can only contain letters, numbers, spaces, and hyphens"),
];
