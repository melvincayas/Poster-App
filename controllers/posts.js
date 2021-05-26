const Post = require("../models/Post");
const User = require("../models/User");
const handleAsync = require("../utilities/handleAsync");
const ExpressError = require("../utilities/ExpressError");

module.exports.index = handleAsync(async (req, res) => {
	const { user_id } = req.session;
	const user = await User.findById(user_id)
		.populate("following")
		.populate("hearted");
	const following = user.following.map(follow => follow._id);
	following.push(user_id);
	const hearted = user.hearted.map(heart => heart._id);
	const bookmarked = user.bookmarked.map(bookmark => bookmark._id);
	const posts = await Post.find({ user: { $in: following } })
		.populate("user", "username")
		.populate({
			path: "comments",
			populate: { path: "replies.user" },
		});
	posts.reverse();
	res.render("posts/index", { posts, hearted, bookmarked });
});

module.exports.heartPost = handleAsync(async (req, res) => {
	const { id } = req.params;
	const { user_id } = req.session;
	const post = await Post.findById(id).populate("user");
	const user = await User.findById(user_id);

	if (user.hearted.includes(post._id)) {
		await User.findByIdAndUpdate(user._id, { $pull: { hearted: post._id } });
		await Post.findByIdAndUpdate(post._id, { $pull: { hearted: user._id } });
	} else {
		user.hearted.push(post);
		post.hearted.push(user);
		await user.save();
		await post.save();

		if (post.user._id.toString() !== user_id) {
			const notification = {
				category: "like",
				date: new Date().toUTCString(),
				content: "liked your",
				user: user,
				post: post,
			};

			const poster = await User.findByIdAndUpdate(post.user._id, {
				$set: { viewedNotifications: false },
			});

			poster.notifications.push(notification);
			await poster.save();
		}
	}

	res.end();
});

module.exports.bookmarkPost = handleAsync(async (req, res) => {
	const { id } = req.params;
	const { user_id } = req.session;

	const post = await Post.findById(id);
	const user = await User.findById(user_id);

	if (user.bookmarked.includes(post._id)) {
		await User.findByIdAndUpdate(user._id, { $pull: { bookmarked: post._id } });
		await Post.findByIdAndUpdate(post._id, { $pull: { bookmarked: user._id } });
	} else {
		user.bookmarked.push(post);
		post.bookmarked.push(user);
		await user.save();
		await post.save();
	}

	res.end();
});

module.exports.showPost = handleAsync(async (req, res, next) => {
	const { id } = req.params;
	const { user_id } = req.session;
	const post = await Post.findById(id)
		.populate("user", "username")
		.populate({
			path: "comments",
			populate: { path: "user" },
		})
		.populate({
			path: "comments",
			populate: { path: "replies.user" },
		});
	if (!post) {
		return next(new ExpressError("Post does not exist!", 404));
	}
	res.render("posts/show", { post, user_id });
});

module.exports.editPostForm = handleAsync(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findById(id).populate("user", "username");
	if (!post) {
		return next(new ExpressError("Post does not exist!", 404));
	}
	res.render("posts/edit", { post });
});

module.exports.addPost = handleAsync(async (req, res) => {
	const { body } = req.body;
	const { user_id } = req.session;
	const user = await User.findOne({ _id: user_id });
	const post = new Post({
		body: body,
		date: new Date().toUTCString(),
		user: user,
	});
	user.posts.push(post);
	await post.save();
	await user.save();
	req.flash("success", "Post added!");
	res.redirect("/posts");
});

module.exports.deletePost = handleAsync(async (req, res) => {
	const { id } = req.params;
	await Post.findByIdAndDelete(id);
	req.flash("success", "Post deleted!");
	res.redirect("/posts");
});

module.exports.editPost = handleAsync(async (req, res) => {
	const { id } = req.params;
	const { body } = req.body;
	await Post.findByIdAndUpdate(id, { body: body });
	req.flash("success", "Posted edited!");
	res.redirect(`/posts/show/${id}`);
});
