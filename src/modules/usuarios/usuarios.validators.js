const { body } = require('express-validator');

const createUsuarioValidator = [
  body('nome').isString().notEmpty().withMessage('Nome é obrigatório.').trim(),
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('senha')
    .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
    .trim(),
  body('role')
    .isIn(['admin', 'gerente', 'operador'])
    .withMessage('Role inválida. Use: admin, gerente ou operador.'),
];

module.exports = { createUsuarioValidator };
