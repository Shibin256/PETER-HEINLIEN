// validators/productValidator.js
import { body } from "express-validator";

export const validateProduct = [
  body("name")
    .notEmpty().withMessage("Product name is required")
    .isString().withMessage("Product name must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isString().withMessage("Category must be a string"),

  body("tags")
    .notEmpty().withMessage("Tags are required")
    .custom((value) => {
      const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
      if (tags.length === 0) {
        throw new Error("Please enter at least one valid tag");
      }
      return true;
    }),

  body("brand")
    .notEmpty().withMessage("Brand is required")
    .isString().withMessage("Brand must be a string"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be a valid number greater than 0"),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 0 }).withMessage("Quantity must be a whole number greater than or equal to 0"),

];
