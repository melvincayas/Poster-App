const handleAsync = require('../utilities/handleAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/User');

module.exports.registerForm = (req, res) => {
    res.render('register');
}

module.exports.createUser = handleAsync(async (req, res, next) => {
    const { username, password, email } = req.body;
    const user = new User({ username, password, email });
    await user.save();
    req.session.user_id = user._id;
    req.flash('success', 'Welcome to Poster!');
    res.redirect('/posts');
})

module.exports.loginForm = handleAsync(async (req, res, next) => {
    res.render('login');
})

module.exports.login = handleAsync(async (req, res, next) => {
    const { username, password } = req.body;
    const validUser = await User.findAndValidate(username, password);
    if (validUser) {
        req.session.user_id = validUser._id;
        res.redirect('/posts');
    } else {
        req.flash('error','Invalid username or password.');
        res.redirect('/login');
    }
})

module.exports.logout = (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
}