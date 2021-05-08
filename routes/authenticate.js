const express = require('express');
const router = express.Router();
const { isValidSignUp } = require('../utilities/middleware/checkValidations');
const authenticate = require('../controllers/authenticate');

router.route('/register')
    .get(authenticate.registerForm)
    .post(isValidSignUp, authenticate.createUser);

router.route('/login')
    .get(authenticate.loginForm)
    .post(authenticate.login);

router.post('/logout', authenticate.logout);

module.exports = router;