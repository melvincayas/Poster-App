const ExpressError = require('../utilities/ExpressError');
const handleAsync = require('../utilities/handleAsync');
const User = require('../models/User');

module.exports.userHomePage = handleAsync(async (req, res, next) => {
    const { username } = req.params;
    const { user_id } = req.session;
    const user = await User.findOne({ username: username }).populate('posts');
    if (!user) {
        return next(new ExpressError('User not found.', 404));
    }
    user.posts.reverse();
    res.render('user', { user, user_id });
})