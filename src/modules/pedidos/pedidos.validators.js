const { body, param } = require('express-validator');

const createPedidoValidator = [
  body('cliente').isString().notEmpty().withMessage('Cliente é obrigatório.').trim(),
  body('entrega').isISO8601().withMessage('Data de entrega inválida (use YYYY-MM-DD).'),
  body('produtos').isArray({ min: 1 }).withMessage('Pedido deve ter ao menos um produto.'),
];

const updateEtapaValidator = [
  param('produtoId').isString().notEmpty().withMessage('ID do produto inválido.'),
  body('setor').isString().notEmpty().withMessage('Setor é obrigatório.').trim(),
  body('campo').isString().notEmpty().withMessage('Campo é obrigatório.').trim(),
  body('valor').exists().withMessage('Valor é obrigatório.'),
];

module.exports = { createPedidoValidator, updateEtapaValidator };
