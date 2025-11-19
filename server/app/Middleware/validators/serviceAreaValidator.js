const { body } = require("express-validator");

const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;


exports.addServiceAreaValidator = [

    // name (required)
    body("name")
        .trim()
        .notEmpty().withMessage("Area name is required")
        .isString().withMessage("Area name must be a string")
        .matches(onlyLettersAndSpaces).withMessage("Area name can contain only letters and spaces")
        .isLength({ min: 2 }).withMessage("Area name must be at least 2 characters long"),

    // city (optional)
    body("city")
        .optional()
        .trim()
        .isString().withMessage("City must be a string")
        .matches(onlyLettersAndSpaces).withMessage("City can contain only letters and spaces"),

    // state (optional)
    body("state")
        .optional()
        .trim()        
        .isString().withMessage("State must be a string")
        .matches(onlyLettersAndSpaces).withMessage("State can contain only letters and spaces"),

    // country (optional)
    body("country")
        .optional()
        .trim()        
        .isString().withMessage("Country must be a string")
        .matches(onlyLettersAndSpaces).withMessage("Country can contain only letters and spaces"),

    // postal_code must be an array
    body("postal_code")
        .optional()
        .isArray().withMessage("postal_code must be an array"),

    // each postal_code entry validation
    body("postal_code.*")
        .optional()
        .trim()
        .isString().withMessage("Each postal_code value must be a string")
        .matches(/^[0-9A-Za-z-]+$/)
        .withMessage("postal_code can contain only letters, numbers, and hyphens"),
];


exports.editServiceAreaValidator = [

    body("name")
        .optional()
        .trim()
        .isString().withMessage("Area name must be a string")
        .matches(onlyLettersAndSpaces).withMessage("Area name can contain only letters and spaces")
        .isLength({ min: 2 }).withMessage("Area name must be at least 2 characters long"),

        // city (optional)
    body("city")
        .optional()
        .trim()
        .isString().withMessage("City must be a string")
        .matches(onlyLettersAndSpaces).withMessage("City can contain only letters and spaces"),

    // state (optional)
    body("state")
        .optional()
        .trim()        
        .isString().withMessage("State must be a string")
        .matches(onlyLettersAndSpaces).withMessage("State can contain only letters and spaces"),

    // country (optional)
    body("country")
        .optional()
        .trim()        
        .isString().withMessage("Country must be a string")
        .matches(onlyLettersAndSpaces).withMessage("Country can contain only letters and spaces"),

    // postal_code must be an array
    body("postal_code")
        .optional()
        .isArray().withMessage("postal_code must be an array"),

    // each postal_code entry validation
    body("postal_code.*")
        .optional()
        .trim()
        .isString().withMessage("Each postal_code value must be a string")
        .matches(/^[0-9A-Za-z-]+$/)
        .withMessage("postal_code can contain only letters, numbers, and hyphens"),


];

