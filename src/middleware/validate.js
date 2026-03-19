const { validationResult } = require('express-validator');
const AppError = require('../errors/AppError');

module.exports = function validate(req, _res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(messages, 422));
  }

  next();
};
