const { body } = require("express-validator");

exports.registerValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .isNumeric().withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 digits long"),

  body("address")
    .trim()
    .notEmpty().withMessage("Address is required")
    .isLength({ min: 5 }).withMessage("Address must be at least 5 characters"),

  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "provider", "admin"]).withMessage("Invalid role value"),

  //  Conditional validation for providers
  body("service_areas")
    .custom((value, { req }) => {
      if (req.body.role === "provider") {
        // Ensure at least one area is selected
        if (!value || !Array.isArray(value) || value.length === 0) {
          throw new Error("Providers must select at least one service area");
        }

        // Ensure all values are valid MongoDB ObjectIds
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        const invalidIds = value.filter(id => !objectIdRegex.test(id));
        if (invalidIds.length > 0) {
          throw new Error("Invalid service area ID(s) detected");
        }
      }
      return true; // validation passed
    }),
];


exports.loginValidationRules = [ 

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

 
];
