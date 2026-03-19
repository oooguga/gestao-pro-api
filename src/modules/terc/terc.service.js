const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

const list = async () => {
  const { data, error } = await supabase.from('terc').select('*').order('created_at', { ascending: false });
  if (error) throw new AppError('Erro ao listar serviços.', 500);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase.from('terc').select('*').eq('id', id).maybeSingle();
  if (error) throw new AppError('Erro ao buscar serviço.', 500);
  if (!data) throw new AppError('Serviço não encontrado.', 404);
  return data;
};

const create = async (body) => {
  const row = { ...body, id: body.id ?? `TERC-${Date.now()}` };
  const { data, error } = await supabase.from('terc').insert(row).select().single();
  if (error) throw new AppError('Erro ao criar serviço.', 500);
  return data;
};

const update = async (id, body) => {
  const { data, error } = await supabase.from('terc').update(body).eq('id', id).select().maybeSingle();
  if (error) throw new AppError('Erro ao atualizar serviço.', 500);
  if (!data) throw new AppError('Serviço não encontrado.', 404);
  return data;
};

const remove = async (id) => {
  const { error, count } = await supabase.from('terc').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AppError('Erro ao excluir serviço.', 500);
  if (count === 0) throw new AppError('Serviço não encontrado.', 404);
};

module.exports = { list, findById, create, update, remove };
