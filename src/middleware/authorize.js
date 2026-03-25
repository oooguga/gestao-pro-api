const AppError = require('../errors/AppError');

const ROLE_PERMISSIONS = {
  admin: [
    'pedidos:list', 'pedidos:create', 'pedidos:edit', 'pedidos:delete', 'etapas:update',
    'terc:list', 'terc:create', 'terc:edit', 'terc:delete',
    'compras:list', 'compras:create', 'compras:edit', 'compras:delete',
    'usuarios:list', 'usuarios:create', 'usuarios:edit', 'usuarios:delete',
    'estoque:list', 'estoque:create', 'estoque:edit', 'estoque:delete',
    'config:list', 'config:edit',
  ],
  gerente: [
    'pedidos:list', 'pedidos:create', 'pedidos:edit', 'etapas:update',
    'terc:list', 'terc:create', 'terc:edit',
    'compras:list', 'compras:create', 'compras:edit',
    'estoque:list', 'estoque:edit',
    'config:list', 'config:edit',
  ],
  operador: [
    'pedidos:list', 'etapas:update',
    'terc:list',
    'compras:list',
    'estoque:list',
    'config:list',
  ],
};

function authorize(permission) {
  return function (req, _res, next) {
    const allowed = ROLE_PERMISSIONS[req.user?.role] ?? [];

    if (!allowed.includes(permission)) {
      return next(new AppError('Acesso negado.', 403));
    }

    next();
  };
}

module.exports = { authorize, ROLE_PERMISSIONS };
