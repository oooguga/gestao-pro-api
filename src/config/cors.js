const { FRONTEND_ORIGIN, NODE_ENV } = require('./env');

// Suporta múltiplas origens separadas por vírgula
// Ex: http://localhost:5173,https://snazzy-longma-205470.netlify.app
const allowedOrigins = FRONTEND_ORIGIN.split(',').map((o) => o.trim());

module.exports = {
  origin: (origin, callback) => {
    // Permitir requisições sem origem (ex: curl, Postman)
    if (!origin) return callback(null, true);
    // Origens explícitas na variável de ambiente
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Em produção, aceitar qualquer subdomínio netlify.app
    if (NODE_ENV === 'production' && origin.endsWith('.netlify.app')) return callback(null, true);
    callback(new Error(`CORS: origem não permitida — ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
