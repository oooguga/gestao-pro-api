const { Router } = require('express');
const controller = require('./terc.controller');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate);

router.get('/',       authorize('terc:list'),   controller.list);
router.get('/:id',    authorize('terc:list'),   controller.getOne);
router.post('/',      authorize('terc:create'), controller.create);
router.put('/:id',    authorize('terc:edit'),   controller.update);
router.delete('/:id', authorize('terc:delete'), controller.remove);

module.exports = router;
