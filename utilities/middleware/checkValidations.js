const { user, post, comment, reply } = require("./validationSchemas");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const ExpressError = require("../ExpressError");

module.exports.isValidSignUp = (req, res, next) => {
	const { error } = user.validate(req.body);
	if (error) {
		next(new ExpressError(error, 400));
	} else {
		next();
	}
};

module.exports.validatePost = (req, res, next) => {
	const { error } = post.validate(req.body);
	if (error) {
		next(new ExpressError(error, 400));
	} else {
		next();
	}
};

module.exports.validateComment = (req, res, next) => {
	const { error } = comment.validate(req.body);
	if (error) {
		next(new ExpressError(error, 400));
	} else {
		next();
	}
};

module.exports.validateReply = (req, res, next) => {
	const { error } = reply.validate(req.body);
	if (error) {
		next(new ExpressError(error, 400));
	} else {
		next();
	}
};

module.exports.validateLoggedIn = (req, res, next) => {
	if (req.session.user_id) return next();

	res.redirect("/login");
};

module.exports.isPostOwner = async (req, res, next) => {
	const { id } = req.params;
	const { user_id } = req.session;
	const post = await Post.findById(id).populate("user", "username");
	if (post.user._id.toString() !== user_id) {
		req.flash("error", "You do not have permission to edit this post.");
		return res.redirect(`/posts/show/${id}`);
	}
	next();
};

module.exports.isCommentOwner = async (req, res, next) => {
	const { postId, commentId } = req.params;
	const { user_id } = req.session;
	const comment = await Comment.findById(commentId);
	if (!comment) {
		return next(new ExpressError("Comment does not exist!", 404));
	}
	if (comment.user._id.toString() !== user_id) {
		req.flash("error", "You do not have permission to edit this comment.");
		return res.redirect(`/posts/show/${postId}`);
	}
	next();
};

module.exports.isReplyOwner = async (req, res, next) => {
	const { postId, commentId, replyId } = req.params;
	const { user_id } = req.session;
	const post = await Post.findById(postId).populate("user", "username");
	if (!post) {
		return next(new ExpressError("Post does not exist!", 404));
	}
	const comment = await Comment.findById(commentId).populate({
		path: "replies",
		populate: { path: "user" },
	});
	if (!comment) {
		return next(new ExpressError("Comment does not exist!", 404));
	}
	const { replies } = comment;
	const [reply] = replies.filter(el => el._id.toString() === replyId);
	if (typeof reply === "undefined" || typeof reply === "null") {
		return next(new ExpressError("Reply does not exist!", 404));
	}
	if (reply.user._id.toString() !== user_id) {
		req.flash("error", "You do not have permission to edit this comment.");
		return res.redirect(`/posts/show/${postId}`);
	}
	next();
};
