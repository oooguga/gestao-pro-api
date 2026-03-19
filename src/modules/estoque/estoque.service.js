const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

const list = async () => {
  const { data, error } = await supabase.from('estoque').select('*').order('nome');
  if (error) throw new AppError('Erro ao listar estoque.', 500);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase.from('estoque').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError('Erro ao buscar item.', 500);
  if (!data) throw new AppError('Item não encontrado.', 404);
  return data;
};

const create = async ({ nome, unidade, qtd_atual, qtd_minima, observacao }) => {
  const row = {
    id: `EST-${Date.now()}`,
    nome,
    unidade: unidade ?? 'unid',
    qtd_atual: qtd_atual ?? 0,
    qtd_minima: qtd_minima ?? 0,
    observacao: observacao ?? null,
  };
  const { data, error } = await supabase.from('estoque').insert(row).select().single();
  if (error) throw new AppError('Erro ao criar item de estoque.', 500);
  return data;
};

const update = async (id, { nome, unidade, qtd_minima, observacao }) => {
  const patch = {};
  if (nome       !== undefined) patch.nome       = nome;
  if (unidade    !== undefined) patch.unidade    = unidade;
  if (qtd_minima !== undefined) patch.qtd_minima = qtd_minima;
  if (observacao !== undefined) patch.observacao = observacao;

  const { data, error } = await supabase.from('estoque').update(patch).eq('id', id).select().maybeSingle();
  if (error) throw new AppError('Erro ao atualizar item.', 500);
  if (!data) throw new AppError('Item não encontrado.', 404);
  return data;
};

const remove = async (id) => {
  const { error, count } = await supabase.from('estoque').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AppError('Erro ao excluir item.', 500);
  if (count === 0) throw new AppError('Item não encontrado.', 404);
};

const registrarMovimento = async (id, { tipo, quantidade, motivo }) => {
  // Buscar item atual
  const item = await findById(id);

  const delta = tipo === 'entrada' ? Number(quantidade) : -Number(quantidade);
  const nova_qtd = Number(item.qtd_atual) + delta;

  // Inserir movimentação
  const mov = {
    id: `MOV-${Date.now()}`,
    estoque_id: id,
    tipo,
    quantidade: Number(quantidade),
    motivo: motivo ?? null,
  };
  const { error: movErr } = await supabase.from('estoque_movimentacoes').insert(mov);
  if (movErr) throw new AppError('Erro ao registrar movimentação.', 500);

  // Atualizar qtd_atual
  const { data, error: updErr } = await supabase
    .from('estoque')
    .update({ qtd_atual: nova_qtd })
    .eq('id', id)
    .select()
    .single();
  if (updErr) throw new AppError('Erro ao atualizar quantidade.', 500);
  return data;
};

const listMovimentos = async (id) => {
  const { data, error } = await supabase
    .from('estoque_movimentacoes')
    .select('*')
    .eq('estoque_id', id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new AppError('Erro ao listar movimentações.', 500);
  return data;
};

module.exports = { list, findById, create, update, remove, registrarMovimento, listMovimentos };
