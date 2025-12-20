const { body } = require("express-validator");

exports.validateTask = [
  body("title").isString().trim().notEmpty(),
  body("status").optional().isIn(["open", "done"]),
];
