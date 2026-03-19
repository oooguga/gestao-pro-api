const service = require('./compras.service');

const list    = (req, res, next) => { try { res.json(service.list()); } catch (e) { next(e); } };
const getOne  = (req, res, next) => { try { res.json(service.findById(req.params.id)); } catch (e) { next(e); } };
const create  = (req, res, next) => { try { res.status(201).json(service.create(req.body)); } catch (e) { next(e); } };
const update  = (req, res, next) => { try { res.json(service.update(req.params.id, req.body)); } catch (e) { next(e); } };
const remove  = (req, res, next) => { try { service.remove(req.params.id); res.status(204).end(); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, remove };
