const { Router } = require('express');
const cookieParser = require('cookie-parser');
const controller = require('./auth.controller');
const { loginValidator } = require('./auth.validators');
const validate = require('../../middleware/validate');

const router = Router();

router.use(cookieParser());

router.post('/login', loginValidator, validate, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);

module.exports = router;
