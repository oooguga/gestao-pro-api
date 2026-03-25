require('./config/env');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const corsOptions   = require('./config/cors');
const authRoutes    = require('./modules/auth/auth.routes');
const pedidosRoutes = require('./modules/pedidos/pedidos.routes');
const tercRoutes    = require('./modules/terc/terc.routes');
const comprasRoutes = require('./modules/compras/compras.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const estoqueRoutes  = require('./modules/estoque/estoque.routes');
const configRoutes   = require('./modules/config/config.routes');
const notFound      = require('./middleware/notFound');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());
app.use(express.json({ limit: '10kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Muitas tentativas. Tente novamente em 15 minutos.' },
});

app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/pedidos',  pedidosRoutes);
app.use('/api/terc',     tercRoutes);
app.use('/api/compras',  comprasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/estoque',  estoqueRoutes);
app.use('/api/config',   configRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
