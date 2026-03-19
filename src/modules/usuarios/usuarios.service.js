const bcrypt = require('bcrypt');
const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

const SALT_ROUNDS = 12;
const SAFE_COLS = 'id, nome, email, role, created_at';

async function listSafe() {
  const { data, error } = await supabase.from('usuarios').select(SAFE_COLS).order('created_at');
  if (error) throw new AppError('Erro ao listar usuários.', 500);
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from('usuarios').select(SAFE_COLS).eq('id', id).maybeSingle();
  if (error) throw new AppError('Erro ao buscar usuário.', 500);
  if (!data) throw new AppError('Usuário não encontrado.', 404);
  return data;
}

async function create({ nome, email, senha, role }) {
  const { data: existing } = await supabase.from('usuarios').select('id').eq('email', email).maybeSingle();
  if (existing) throw new AppError('E-mail já cadastrado.', 409);

  const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
  const { data, error } = await supabase
    .from('usuarios')
    .insert({ nome, email, senha_hash, role })
    .select(SAFE_COLS)
    .single();

  if (error) throw new AppError('Erro ao criar usuário.', 500);
  return data;
}

async function update(id, { nome, email, senha, role }) {
  const patch = {};
  if (nome)  patch.nome  = nome;
  if (email) patch.email = email;
  if (role)  patch.role  = role;
  if (senha) patch.senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);

  const { data, error } = await supabase
    .from('usuarios')
    .update(patch)
    .eq('id', id)
    .select(SAFE_COLS)
    .maybeSingle();

  if (error) throw new AppError('Erro ao atualizar usuário.', 500);
  if (!data) throw new AppError('Usuário não encontrado.', 404);
  return data;
}

async function remove(id) {
  const { error, count } = await supabase.from('usuarios').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AppError('Erro ao excluir usuário.', 500);
  if (count === 0) throw new AppError('Usuário não encontrado.', 404);
}

module.exports = { listSafe, findById, create, update, remove };
