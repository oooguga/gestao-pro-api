// ─── migrate.js ───────────────────────────────────────────────────────────────
// Executa migrações automaticamente na inicialização do servidor.
// Usa DATABASE_URL (conexão direta ao PostgreSQL do Supabase).
// Seguro para rodar múltiplas vezes — usa IF NOT EXISTS / IF NOT EXISTS.

const { Client } = require('pg');

const SQL = `
-- ─── Tabela de configurações dinâmicas ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracoes (
  chave      TEXT PRIMARY KEY,
  valor      JSONB        NOT NULL DEFAULT 'null',
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── Tabela de compras (estrutura nova com itens JSONB) ───────────────────────
CREATE TABLE IF NOT EXISTS compras (
  id          TEXT PRIMARY KEY,
  pedidos     JSONB    DEFAULT '[]',
  estoque     BOOLEAN  DEFAULT false,
  fornecedor  TEXT,
  solicitacao TEXT,
  previsao    TEXT,
  obs         TEXT,
  status      TEXT     NOT NULL DEFAULT 'Solicitado',
  itens       JSONB    DEFAULT '[]',
  received_at TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabela de estoque ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS estoque (
  id          TEXT PRIMARY KEY,
  nome        TEXT     NOT NULL,
  unidade     TEXT     NOT NULL DEFAULT 'unid',
  qtd_atual   NUMERIC  NOT NULL DEFAULT 0,
  qtd_minima  NUMERIC  NOT NULL DEFAULT 0,
  categoria   TEXT,
  observacao  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabela de movimentações de estoque ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
  id          TEXT PRIMARY KEY,
  estoque_id  TEXT     REFERENCES estoque(id) ON DELETE CASCADE,
  tipo        TEXT     NOT NULL,
  quantidade  NUMERIC  NOT NULL,
  motivo      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Colunas adicionais (safe — só adiciona se não existir) ──────────────────
ALTER TABLE estoque ADD COLUMN IF NOT EXISTS categoria   TEXT;
ALTER TABLE estoque ADD COLUMN IF NOT EXISTS observacao  TEXT;
`;

async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn('[migrate] DATABASE_URL não definida — pulando migrações automáticas.');
    return;
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('[migrate] ✓ Migrações executadas com sucesso.');
  } catch (err) {
    console.error('[migrate] Erro nas migrações:', err.message);
  } finally {
    await client.end();
  }
}

module.exports = runMigrations;
