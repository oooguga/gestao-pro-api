-- ─── GestãoPro — Migração inicial ────────────────────────────────────────────
-- Executar no Supabase: Dashboard → SQL Editor → New query → Cole e rode.
-- RLS desabilitado: o backend controla acesso via RBAC próprio (JWT + authorize).

-- ── Usuários ─────────────────────────────────────────────────────────────────
create table if not exists usuarios (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text unique not null,
  senha_hash  text not null,
  role        text not null check (role in ('admin', 'gerente', 'operador')),
  created_at  timestamptz not null default now()
);

alter table usuarios disable row level security;

-- ── Pedidos ───────────────────────────────────────────────────────────────────
create table if not exists pedidos (
  id          text primary key,
  cliente     text not null,
  entrega     date,
  created_at  timestamptz not null default now()
);

alter table pedidos disable row level security;

-- ── Produtos (vinculados a pedidos, etapas em JSONB) ─────────────────────────
create table if not exists produtos (
  id            text primary key,
  pedido_id     text not null references pedidos(id) on delete cascade,
  produto       text,
  codigo        text,
  qtd           integer,
  larg          numeric,
  prof          numeric,
  alt           numeric,
  aco           text,
  aco_custom    text,
  madeira_cfg   text,
  madeira_items jsonb default '[]',
  eletrica_cfg  text,
  eletrica_items jsonb default '[]',
  couro         text,
  obs           text,
  etapas        jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

alter table produtos disable row level security;

create index if not exists produtos_pedido_id_idx on produtos(pedido_id);

-- ── Serviços terceirizados ────────────────────────────────────────────────────
create table if not exists terc (
  id              text primary key,
  pedidos         text[] default '{}',
  codigos         text[] default '{}',
  lote            text,
  orcamento       text,
  fornecedor      text,
  previsao        date,
  link_drive      text,
  obs             text,
  status          text,
  checklist       jsonb default '{}',
  planilha_itens  jsonb default '[]',
  created_at      timestamptz not null default now()
);

alter table terc disable row level security;

-- ── Compras de materiais ──────────────────────────────────────────────────────
create table if not exists compras (
  id          text primary key,
  pedido_id   text,
  categoria   text,
  item        text,
  qtd         integer,
  fornecedor  text,
  solicitacao date,
  previsao    date,
  status      text,
  obs         text,
  created_at  timestamptz not null default now()
);

alter table compras disable row level security;
