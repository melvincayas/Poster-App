const User = require("../models/User");
const Post = require("../models/Post");
const handleAsync = require("../utilities/handleAsync");

module.exports.searchForm = handleAsync(async (req, res) => {
	const { user_id } = req.session;
	const { query, type } = req.query;
	let followingIds = [];
	let users = [];
	let posts = [];

	if (query && query.trim() !== "" && type !== "post") {
		if (user_id) {
			const user = await User.findById(user_id).populate("following");
			followingIds = user.following.map(follow => follow._id);
		}

		users = await User.find({
			$or: [
				{ username: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			],
		});
	} else if (type === "post") {
		posts = await Post.find({
			body: { $regex: query, $options: "i" },
		}).populate("user", "username");
	}

	res.render("search", { users, followingIds, query, posts, user_id });
});
