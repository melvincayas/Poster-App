const express = require('express');
const router = express.Router();
const { validateLoggedIn } = require('../utilities/middleware/checkValidations');
const user = require('../controllers/user');

router.get('/:username', user.userHomePage);

module.exports = router;