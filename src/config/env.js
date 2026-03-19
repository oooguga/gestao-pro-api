require('dotenv').config();

const required = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_ORIGIN',
  'NODE_ENV',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
}

module.exports = {
  JWT_ACCESS_SECRET:        process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET:       process.env.JWT_REFRESH_SECRET,
  FRONTEND_ORIGIN:          process.env.FRONTEND_ORIGIN,
  NODE_ENV:                 process.env.NODE_ENV,
  PORT:                     parseInt(process.env.PORT ?? '3001', 10),
  SUPABASE_URL:             process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
