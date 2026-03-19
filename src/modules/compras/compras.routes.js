const { Router } = require('express');
const controller = require('./compras.controller');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate);

router.get('/',       authorize('compras:list'),   controller.list);
router.get('/:id',    authorize('compras:list'),   controller.getOne);
router.post('/',      authorize('compras:create'), controller.create);
router.put('/:id',    authorize('compras:edit'),   controller.update);
router.delete('/:id', authorize('compras:delete'), controller.remove);

module.exports = router;
