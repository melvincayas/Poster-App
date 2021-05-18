const User = require("../models/User");
const Post = require("../models/Post");
const handleAsync = require("../utilities/handleAsync");

module.exports.searchForm = handleAsync(async (req, res) => {
	const { user_id } = req.session;
	const { query, type } = req.query;
	const user = await User.findById(user_id).populate("following");
	let followingIds = [];
	let users = [];
	let posts = [];
	let hearted = [];
	let bookmarked = [];

	if (query && query.trim() !== "" && type !== "post") {
		if (user_id) {
			followingIds = user.following.map(follow => follow._id);
		}

		users = await User.find({
			$or: [
				{ username: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			],
		});
	} else if (type === "post") {
		if (user_id) {
			hearted = user.hearted.map(heart => heart._id);
			bookmarked = user.bookmarked.map(bookmark => bookmark._id);
		}
		posts = await Post.find({
			body: { $regex: query, $options: "i" },
		})
			.populate("user", "username")
			.populate("comments");
	}

	res.render("search", {
		users,
		followingIds,
		query,
		posts,
		user_id,
		hearted,
		bookmarked,
	});
});
