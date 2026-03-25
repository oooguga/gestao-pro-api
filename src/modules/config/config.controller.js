const service = require('./config.service');

const getAll = async (_req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (e) { next(e); }
};

const getOne = async (req, res, next) => {
  try {
    const valor = await service.get(req.params.chave);
    res.json({ chave: req.params.chave, valor });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { valor } = req.body;
    if (valor === undefined) return res.status(400).json({ message: 'Campo "valor" obrigatório.' });
    const data = await service.set(req.params.chave, valor);
    res.json(data);
  } catch (e) { next(e); }
};

module.exports = { getAll, getOne, update };
