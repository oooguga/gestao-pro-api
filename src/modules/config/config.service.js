const supabase  = require('../../config/supabase');
const AppError  = require('../../errors/AppError');

// ─── Valores padrão (usados se a chave ainda não existir no banco) ────────────
const DEFAULTS = {
  mp_madeira:  ['Lâmina natural preta', 'Lâmina natural amadeirada', 'Melamínico preto', 'Melamínico amadeirado'],
  mp_eletrica: ['Tomadas', 'USB-A', 'Personalizado'],
  mp_couro:    ['Couro Natural', 'Couro Sintético', 'Personalizado'],
  compras_categorias: [
    { nome: 'Aço',     itens: ['Barra chata', 'Barra redonda', 'Chapa', 'Tubo'] },
    { nome: 'Madeira', itens: ['MDF', 'MDP', 'Compensado', 'Madeira maciça'] },
    { nome: 'Couro',   itens: ['Couro natural', 'Couro sintético'] },
  ],
  config_fornecedores_servicos: [],
  config_sheets_url: '',
  config_gas_url:    '',
};

// ─── Retorna todas as configs mesclando defaults + valores do banco ───────────
const getAll = async () => {
  const { data, error } = await supabase.from('configuracoes').select('*');
  if (error) throw new AppError('Erro ao listar configurações.', 500);
  const result = { ...DEFAULTS };
  if (data) data.forEach(({ chave, valor }) => { result[chave] = valor; });
  return result;
};

// ─── Retorna uma config específica (fallback para o default) ─────────────────
const get = async (chave) => {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('valor')
    .eq('chave', chave)
    .maybeSingle();
  if (error) throw new AppError('Erro ao buscar configuração.', 500);
  return data ? data.valor : (DEFAULTS[chave] ?? null);
};

// ─── Grava ou atualiza uma config ─────────────────────────────────────────────
const set = async (chave, valor) => {
  const { data, error } = await supabase
    .from('configuracoes')
    .upsert(
      { chave, valor, updated_at: new Date().toISOString() },
      { onConflict: 'chave' }
    )
    .select()
    .single();
  if (error) throw new AppError('Erro ao salvar configuração.', 500);
  return data;
};

module.exports = { getAll, get, set, DEFAULTS };
