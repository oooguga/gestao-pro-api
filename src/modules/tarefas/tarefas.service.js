const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

// ─── Colunas ──────────────────────────────────────────────────────────────────
const listColunasComTarefas = async () => {
  const [{ data: colunas, error: e1 }, { data: tarefas, error: e2 }] = await Promise.all([
    supabase.from('tarefas_colunas').select('*').order('ordem'),
    supabase.from('tarefas').select('*').order('ordem'),
  ]);
  if (e1 || e2) throw new AppError('Erro ao listar tarefas.', 500);
  return (colunas ?? []).map((col) => ({
    ...col,
    tarefas: (tarefas ?? []).filter((t) => t.coluna_id === col.id),
  }));
};

const createColuna = async ({ nome, cor, ordem }) => {
  const row = { id: `COL-${Date.now()}`, nome, cor: cor ?? '#2d4a2d', ordem: ordem ?? 999 };
  const { data, error } = await supabase.from('tarefas_colunas').insert(row).select().single();
  if (error) throw new AppError('Erro ao criar coluna.', 500);
  return { ...data, tarefas: [] };
};

const updateColuna = async (id, patch) => {
  const { data, error } = await supabase
    .from('tarefas_colunas').update(patch).eq('id', id).select().single();
  if (error) throw new AppError('Erro ao atualizar coluna.', 500);
  return data;
};

const deleteColuna = async (id) => {
  const { error } = await supabase.from('tarefas_colunas').delete().eq('id', id);
  if (error) throw new AppError('Erro ao excluir coluna.', 500);
};

// ─── Tarefas ──────────────────────────────────────────────────────────────────
const createTarefa = async (body) => {
  const row = {
    id:        `TAR-${Date.now()}`,
    coluna_id: body.coluna_id,
    titulo:    body.titulo,
    concluido: body.concluido ?? false,
    cor:       body.cor       ?? null,
    ordem:     body.ordem     ?? 999,
  };
  const { data, error } = await supabase.from('tarefas').insert(row).select().single();
  if (error) throw new AppError('Erro ao criar tarefa.', 500);
  return data;
};

const updateTarefa = async (id, patch) => {
  const { data, error } = await supabase
    .from('tarefas').update(patch).eq('id', id).select().single();
  if (error) throw new AppError('Erro ao atualizar tarefa.', 500);
  return data;
};

const deleteTarefa = async (id) => {
  const { error } = await supabase.from('tarefas').delete().eq('id', id);
  if (error) throw new AppError('Erro ao excluir tarefa.', 500);
};

module.exports = {
  listColunasComTarefas,
  createColuna, updateColuna, deleteColuna,
  createTarefa, updateTarefa, deleteTarefa,
};
