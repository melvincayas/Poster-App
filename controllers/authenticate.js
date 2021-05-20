const handleAsync = require("../utilities/handleAsync");
const User = require("../models/User");

module.exports.registerForm = (req, res) => {
	res.render("register");
};

module.exports.createUser = handleAsync(async (req, res, next) => {
	const { username, password, email } = req.body;
	const user = new User({
		username: username,
		uniqueName: username.toLowerCase(),
		password,
		email,
		joined: new Date().toUTCString(),
	});

	if (await User.findOne({ uniqueName: user.uniqueName })) {
		req.flash("error", "Username already exists!");
		return res.redirect("register");
	} else if (await User.findOne({ email: user.email })) {
		req.flash("error", "An account exists with that email!");
		return res.redirect("register");
	}

	await user.save();
	req.session.user_id = user._id;
	req.flash("success", `Welcome to Poster, ${user.username}!`);
	res.redirect("/posts");
});

module.exports.loginForm = handleAsync(async (req, res, next) => {
	res.render("login");
});

module.exports.login = handleAsync(async (req, res, next) => {
	const { username, password } = req.body;
	const validUser = await User.findAndValidate(username, password);

	if (validUser) {
		req.session.user_id = validUser._id;
		req.flash("success", `Welcome back, ${username}!`);
		res.redirect("/posts");
	} else {
		req.flash("error", "Invalid username or password.");
		res.redirect("/login");
	}
});

module.exports.logout = (req, res) => {
	req.session.user_id = null;
	res.redirect("/login");
};
