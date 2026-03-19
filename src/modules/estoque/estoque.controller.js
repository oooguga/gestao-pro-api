const service = require('./estoque.service');

const list    = async (req, res, next) => { try { res.json(await service.list()); } catch (e) { next(e); } };
const getOne  = async (req, res, next) => { try { res.json(await service.findById(req.params.id)); } catch (e) { next(e); } };
const create  = async (req, res, next) => { try { res.status(201).json(await service.create(req.body)); } catch (e) { next(e); } };
const update  = async (req, res, next) => { try { res.json(await service.update(req.params.id, req.body)); } catch (e) { next(e); } };
const remove  = async (req, res, next) => { try { await service.remove(req.params.id); res.status(204).end(); } catch (e) { next(e); } };

const registrarMov = async (req, res, next) => {
  try { res.json(await service.registrarMovimento(req.params.id, req.body)); } catch (e) { next(e); }
};

const listMovimentos = async (req, res, next) => {
  try { res.json(await service.listMovimentos(req.params.id)); } catch (e) { next(e); }
};

module.exports = { list, getOne, create, update, remove, registrarMov, listMovimentos };
