const { Router } = require('express');
const controller = require('./usuarios.controller');
const { createUsuarioValidator } = require('./usuarios.validators');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate);
router.use(authorize('usuarios:list'));

router.get('/',       controller.list);
router.get('/:id',    controller.getOne);
router.post('/',      authorize('usuarios:create'), createUsuarioValidator, validate, controller.create);
router.put('/:id',    authorize('usuarios:edit'),   controller.update);
router.delete('/:id', authorize('usuarios:delete'), controller.remove);

module.exports = router;
