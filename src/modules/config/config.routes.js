const { Router }   = require('express');
const controller   = require('./config.controller');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate);

router.get('/',          authorize('config:list'), controller.getAll);
router.get('/:chave',    authorize('config:list'), controller.getOne);
router.put('/:chave',    authorize('config:edit'), controller.update);

module.exports = router;
