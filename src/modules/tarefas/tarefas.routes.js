const { Router }    = require('express');
const controller    = require('./tarefas.controller');
const authenticate  = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate);

// Colunas
router.get   ('/colunas',     authorize('tarefas:list'),   controller.listColunas);
router.post  ('/colunas',     authorize('tarefas:create'), controller.createColuna);
router.put   ('/colunas/:id', authorize('tarefas:edit'),   controller.updateColuna);
router.delete('/colunas/:id', authorize('tarefas:delete'), controller.deleteColuna);

// Tarefas (cartões)
router.post  ('/',     authorize('tarefas:create'), controller.createTarefa);
router.put   ('/:id',  authorize('tarefas:edit'),   controller.updateTarefa);
router.delete('/:id',  authorize('tarefas:delete'), controller.deleteTarefa);

module.exports = router;
