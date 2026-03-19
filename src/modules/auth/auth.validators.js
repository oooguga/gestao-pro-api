const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),
  body('senha')
    .isString().withMessage('Senha inválida.')
    .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
    .trim(),
];

module.exports = { loginValidator };
