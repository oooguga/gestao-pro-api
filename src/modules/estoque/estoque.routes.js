const { Router } = require('express');
const controller = require('./estoque.controller');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate);

router.get('/',              authorize('estoque:list'),   controller.list);
router.get('/:id',           authorize('estoque:list'),   controller.getOne);
router.post('/',             authorize('estoque:create'), controller.create);
router.put('/:id',           authorize('estoque:edit'),   controller.update);
router.delete('/:id',        authorize('estoque:delete'), controller.remove);
router.post('/:id/mov',      authorize('estoque:edit'),   controller.registrarMov);
router.get('/:id/mov',       authorize('estoque:list'),   controller.listMovimentos);

module.exports = router;
