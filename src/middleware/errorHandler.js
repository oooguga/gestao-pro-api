const { NODE_ENV } = require('../config/env');

module.exports = function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode ?? 500;

  if (!err.isOperational) {
    console.error('[UNHANDLED ERROR]', err);
  }

  const body = {
    status: 'error',
    message: err.isOperational ? err.message : 'Erro interno do servidor.',
  };

  if (NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
