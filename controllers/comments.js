const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const handleAsync = require("../utilities/handleAsync");
const ExpressError = require("../utilities/ExpressError");

module.exports.showComment = handleAsync(async (req, res) => {
	const { postId, commentId } = req.params;
	const { user_id } = req.session;
	const post = await Post.findById(postId);
	if (!post) {
		return next(new ExpressError("Post does not exist!", 404));
	}
	const comment = await Comment.findById(commentId)
		.populate("user", "username")
		.populate({
			path: "replies",
			populate: { path: "user" },
		});
	res.render("comments/show", { post, comment, user_id });
});

module.exports.editCommentForm = handleAsync(async (req, res, next) => {
	const { postId, commentId } = req.params;
	const post = await Post.findById(postId).populate("user", "username");
	if (!post) {
		return next(new ExpressError("Post does not exist!", 404));
	}
	const comment = await Comment.findById(commentId);
	if (!comment) {
		return next(new ExpressError("Comment does not exist!", 404));
	}
	res.render("comments/edit", { comment, post });
});

module.exports.addComment = handleAsync(async (req, res) => {
	const { id } = req.params;
	const { body } = req.body;
	const { user_id } = req.session;

	const post = await Post.findById(id).populate("user", "username");
	const user = await User.findById(user_id);

	const comment = new Comment({
		body: body,
		date: new Date().toUTCString(),
		post: post,
		user: user,
	});

	post.comments.push(comment);
	user.comments.push(comment);

	await comment.save();
	await post.save();
	await user.save();

	if (post.user._id.toString() !== user_id) {
		const notification = {
			category: "comment",
			date: comment.date,
			content: comment.body,
			user: user,
			post: post,
			comment: comment,
		};

		const postOwner = await User.findByIdAndUpdate(post.user._id, {
			$set: { viewedNotifications: false },
		});
		postOwner.notifications.push(notification);

		await postOwner.save();
	}

	req.flash("success", `Commented on ${post.user.username}'s post!`);
	res.redirect(`/posts/show/${id}`);
});

module.exports.editComment = handleAsync(async (req, res) => {
	const { postId, commentId } = req.params;
	const { body } = req.body;
	await Comment.findByIdAndUpdate(commentId, { body: body });
	req.flash("success", "Comment edited!");
	res.redirect(`/posts/show/${postId}`);
});

module.exports.deleteComment = handleAsync(async (req, res) => {
	const { postId, commentId } = req.params;
	await Comment.findByIdAndDelete(commentId);
	req.flash("success", "Comment deleted!");
	res.redirect(`/posts/show/${postId}`);
});
