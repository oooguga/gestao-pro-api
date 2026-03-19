const AppError = require('../errors/AppError');

module.exports = function notFound(req, _res, next) {
  next(new AppError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
};
