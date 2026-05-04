const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);

module.exports = router;
