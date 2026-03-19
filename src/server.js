const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`[gestao-pro-api] Rodando na porta ${PORT} (${process.env.NODE_ENV})`);
});
