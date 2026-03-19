const authService = require('./auth.service');
const { NODE_ENV } = require('../../config/env');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken } = await authService.login(req.body.email, req.body.senha);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { accessToken } = await authService.refresh(req.cookies.refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

function logout(_req, res) {
  res.clearCookie('refreshToken', COOKIE_OPTS).status(204).end();
}

module.exports = { login, refresh, logout };
