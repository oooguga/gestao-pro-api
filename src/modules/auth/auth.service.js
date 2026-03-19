const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../../config/env');
const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

const DUMMY_HASH = '$2b$12$invalidsaltfortimingprotectionXXXXXXXXXXXXXXXXXXXXXX';

function issueAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function issueRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

async function login(email, senha) {
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id, role, senha_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) throw new AppError('Erro ao autenticar.', 500);

  const hash = user?.senha_hash ?? DUMMY_HASH;
  const match = await bcrypt.compare(senha, hash);

  if (!user || !match) throw new AppError('E-mail ou senha inválidos.', 401);

  return {
    accessToken: issueAccessToken(user),
    refreshToken: issueRefreshToken(user),
  };
}

async function refresh(token) {
  if (!token) throw new AppError('Refresh token ausente.', 401);

  let payload;
  try {
    payload = jwt.verify(token, JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Refresh token inválido ou expirado.', 401);
  }

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id, role')
    .eq('id', payload.sub)
    .maybeSingle();

  if (error || !user) throw new AppError('Usuário não encontrado.', 401);

  return { accessToken: issueAccessToken(user) };
}

module.exports = { login, refresh };
