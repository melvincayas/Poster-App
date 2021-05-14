const User = require("../models/User");
const ExpressError = require("../utilities/ExpressError");
const handleAsync = require("../utilities/handleAsync");
const checkIfFollowing = require("../utilities/checkIfFollowing");

module.exports.userHomePage = handleAsync(async (req, res, next) => {
	const { username } = req.params; // requested user
	const { user_id } = req.session; // user surfing

	const user = await User.findOne({ username: username })
		.populate({
			path: "posts",
			populate: { path: "user" },
		})
		.populate({
			path: "posts",
			populate: { path: "comments" },
		});
	if (!user) {
		return next(new ExpressError("User not found.", 404));
	}

	const userLoggedIn = await User.findById(user_id);
	const isFollowing = checkIfFollowing(user, userLoggedIn, user_id);

	user.posts.reverse();
	res.render("users/userProfile", { user, user_id, isFollowing });
});

module.exports.followUser = handleAsync(async (req, res) => {
	const { user_id } = req.session; // user that will do the following
	const { username } = req.params; // who the user wants to follow

	const user = await User.findById(user_id); // user that will do the following
	const userToFollow = await User.findOne({ username: username }); // who the user wants to follow

	if (user.following.includes(userToFollow._id)) {
		await User.findByIdAndUpdate(user._id, {
			$pull: { following: userToFollow._id },
		});
		await User.findByIdAndUpdate(userToFollow._id, {
			$pull: { followers: user._id },
		});
		req.flash("success", `You have unfollowed ${username}.`);
	} else {
		user.following.push(userToFollow);
		userToFollow.followers.push(user);
		await user.save();
		await userToFollow.save();
		req.flash("success", `You are now following ${username}!`);
	}
	res.redirect(`/user/${username}`);
});

module.exports.showFollowers = handleAsync(async (req, res) => {
	const { username } = req.params;
	const { user_id } = req.session;

	const user = await User.findOne({ username: username })
		.populate("posts")
		.populate("followers");

	const userLoggedIn = await User.findById(user_id);
	const isFollowing = checkIfFollowing(user, userLoggedIn, user_id);
	user.followers.sort();
	res.render("users/followers", { user, user_id, isFollowing });
});

module.exports.showFollowing = handleAsync(async (req, res) => {
	const { username } = req.params;
	const { user_id } = req.session;

	const user = await User.findOne({ username: username })
		.populate("posts")
		.populate("following");

	const userLoggedIn = await User.findById(user_id);
	const isFollowing = checkIfFollowing(user, userLoggedIn, user_id);
	user.following.sort();
	res.render("users/following", { user, user_id, isFollowing });
});
