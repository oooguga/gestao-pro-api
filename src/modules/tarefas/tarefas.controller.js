const svc = require('./tarefas.service');

// ─── Colunas ──────────────────────────────────────────────────────────────────
const listColunas = async (_req, res, next) => {
  try { res.json(await svc.listColunasComTarefas()); } catch (e) { next(e); }
};

const createColuna = async (req, res, next) => {
  try {
    const { nome, cor, ordem } = req.body;
    if (!nome) return res.status(400).json({ message: 'Campo "nome" obrigatório.' });
    res.status(201).json(await svc.createColuna({ nome, cor, ordem }));
  } catch (e) { next(e); }
};

const updateColuna = async (req, res, next) => {
  try { res.json(await svc.updateColuna(req.params.id, req.body)); } catch (e) { next(e); }
};

const deleteColuna = async (req, res, next) => {
  try { await svc.deleteColuna(req.params.id); res.status(204).end(); } catch (e) { next(e); }
};

// ─── Tarefas ──────────────────────────────────────────────────────────────────
const createTarefa = async (req, res, next) => {
  try {
    const { coluna_id, titulo } = req.body;
    if (!coluna_id || !titulo) return res.status(400).json({ message: 'coluna_id e titulo são obrigatórios.' });
    res.status(201).json(await svc.createTarefa(req.body));
  } catch (e) { next(e); }
};

const updateTarefa = async (req, res, next) => {
  try { res.json(await svc.updateTarefa(req.params.id, req.body)); } catch (e) { next(e); }
};

const deleteTarefa = async (req, res, next) => {
  try { await svc.deleteTarefa(req.params.id); res.status(204).end(); } catch (e) { next(e); }
};

module.exports = { listColunas, createColuna, updateColuna, deleteColuna, createTarefa, updateTarefa, deleteTarefa };
