// validators/addressValidator.js
import { body } from "express-validator";

export const validateAddress = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isAlpha("en-US", { ignore: " " }).withMessage("Name must contain only letters and spaces")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("house")
    .trim()
    .notEmpty().withMessage("House number is required")
    .isLength({ min: 1, max: 50 }).withMessage("House number must be between 1 and 50 characters"),

  body("locality")
    .trim()
    .notEmpty().withMessage("Locality is required")
    .isLength({ min: 2, max: 100 }).withMessage("Locality must be between 2 and 100 characters"),

  body("city")
    .trim()
    .notEmpty().withMessage("City is required")
    .isAlpha("en-US", { ignore: " " }).withMessage("City must contain only letters and spaces"),

  body("state")
    .trim()
    .notEmpty().withMessage("State is required")
    .isAlpha("en-US", { ignore: " " }).withMessage("State must contain only letters and spaces"),

  body("pin")
    .trim()
    .notEmpty().withMessage("PIN code is required")
    .matches(/^[1-9][0-9]{5}$/).withMessage("PIN code must be a valid 6-digit Indian postal code"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/).withMessage("Phone number must be a valid 10-digit Indian number"),

  body("altPhone")
    .optional({ checkFalsy: true })
    .matches(/^[6-9]\d{9}$/).withMessage("Alternate phone must be a valid 10-digit Indian number")
    .custom((value, { req }) => {
      if (value && value === req.body.phone) {
        throw new Error("Alternate phone cannot be the same as the primary phone");
      }
      return true;
    }),

  body("addressType")
    .optional()
    .isIn(["home", "work", "other"]).withMessage("Address type must be home, work, or other"),

  body("defaultAddress")
    .optional()
    .isBoolean().withMessage("Default address must be true or false"),
];
