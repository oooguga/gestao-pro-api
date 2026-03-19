const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

const list = async () => {
  const { data, error } = await supabase.from('compras').select('*').order('created_at', { ascending: false });
  if (error) throw new AppError('Erro ao listar compras.', 500);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase.from('compras').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError('Erro ao buscar compra.', 500);
  if (!data) throw new AppError('Compra não encontrada.', 404);
  return data;
};

const create = async (body) => {
  const row = { ...body, id: body.id ?? `CMP-${Date.now()}` };
  const { data, error } = await supabase.from('compras').insert(row).select().single();
  if (error) throw new AppError('Erro ao criar compra.', 500);
  return data;
};

const update = async (id, body) => {
  const { data, error } = await supabase.from('compras').update(body).eq('id', id).select().maybeSingle();
  if (error) throw new AppError('Erro ao atualizar compra.', 500);
  if (!data) throw new AppError('Compra não encontrada.', 404);
  return data;
};

const remove = async (id) => {
  const { error, count } = await supabase.from('compras').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AppError('Erro ao excluir compra.', 500);
  if (count === 0) throw new AppError('Compra não encontrada.', 404);
};

module.exports = { list, findById, create, update, remove };
