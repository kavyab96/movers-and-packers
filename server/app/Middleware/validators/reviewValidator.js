
const { body } = require("express-validator");

exports.reviewValidator = [

    // service_request_id
    body("service_request_id")
        .notEmpty().withMessage("service_request_id is required")
        .isMongoId().withMessage("service_request_id must be a valid Mongo ID"),

    // rating
    body("rating")
        .notEmpty().withMessage("rating is required")
        .isInt({ min: 1, max: 5 }).withMessage("rating must be an integer between 1 and 5"),

    // review_text (optional)
    body("review_text")
        .optional()
        .isString().withMessage("review_text must be a string"),
];
