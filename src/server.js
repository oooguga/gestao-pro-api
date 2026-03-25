const app          = require('./app');
const { PORT }     = require('./config/env');
const runMigrations = require('./db/migrate');

// Executa migrações antes de iniciar o servidor
runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`[gestao-pro-api] Rodando na porta ${PORT} (${process.env.NODE_ENV})`);
  });
});
