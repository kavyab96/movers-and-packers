const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {


    // Get only "required" field errors
    const missingFields = errors.array()
      .filter(err => err.msg.includes("is required"))
      .map(err => err.path);

    if (missingFields.length > 0) {

      const fieldList = missingFields.join(", ");
      const verb = missingFields.length === 1 ? "is" : "are";

      return res.status(400).json({
        message: `${fieldList} ${verb} required.`,
      });
      // return res.status(400).json({
      //   message: `${missingFields.join(", ")} are required.`,
      // });
    }


    // For other errors (format, regex etc) send full list
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};
