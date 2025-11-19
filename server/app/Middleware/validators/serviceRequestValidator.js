
const { body } = require("express-validator");

exports.createBookingValidator = [

    // client_id
    body("client_id")
        .notEmpty().withMessage("client_id is required")
        .isMongoId().withMessage("client_id must be a valid Mongo ID"),

    // provider_id
    body("provider_id")
        .notEmpty().withMessage("provider_id is required")
        .isMongoId().withMessage("provider_id must be a valid Mongo ID"),

    // service_type
    body("service_type")
        .notEmpty().withMessage("service_type is required")
        .isIn(["moving", "packing", "both"])
        .withMessage("service_type must be one of: moving, packing, both"),

    // pickup_location
    body("pickup_location")
        .notEmpty().withMessage("pickup_location is required")
        .isString().withMessage("pickup_location must be a string"),

    // dropoff_location — required ONLY if service_type != "packing"
    body("dropoff_location")
        .if(body("service_type").custom(val => val !== "packing"))
        .notEmpty().withMessage("dropoff_location is required for moving or both")
        .isString().withMessage("dropoff_location must be a string"),

    // area_in_square_feet
    body("area_in_square_feet")
        .notEmpty().withMessage("area_in_square_feet is required")
        .isNumeric().withMessage("area_in_square_feet must be a number"),

    body("requested_date_time")
        .notEmpty().withMessage("requested_date_time is required")
        .isISO8601().withMessage("requested_date_time must be in YYYY-MM-DD format (example: 2025-11-22)")
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error("requested_date_time must be a future date");
            }
            return true;
        }),

    // notes (optional)
    body("notes")
        .optional()
        .matches(/^[A-Za-z0-9\s-]*$/)
        .withMessage("notes can only contain letters, numbers, spaces, and hyphens"),
];
