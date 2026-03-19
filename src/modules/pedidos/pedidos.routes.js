const { Router } = require('express');
const controller = require('./pedidos.controller');
const { createPedidoValidator, updateEtapaValidator } = require('./pedidos.validators');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate);

router.get('/',    authorize('pedidos:list'),   controller.list);
router.get('/:id', authorize('pedidos:list'),   controller.getOne);
router.post('/',   authorize('pedidos:create'), createPedidoValidator, validate, controller.create);
router.put('/:id', authorize('pedidos:edit'),   createPedidoValidator, validate, controller.update);
router.delete('/:id', authorize('pedidos:delete'), controller.remove);
router.patch('/:id/produtos/:produtoId/etapa', authorize('etapas:update'), updateEtapaValidator, validate, controller.updateEtapa);

module.exports = router;
