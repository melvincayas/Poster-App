const User = require("../models/User");
const Post = require("../models/Post");
const handleAsync = require("../utilities/handleAsync");

module.exports.searchForm = handleAsync(async (req, res) => {
	const { query, type } = req.query;
	let users = [];
	let posts = [];

	if (query && query !== "" && type !== "post") {
		users = await User.find({
			$or: [
				{ username: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			],
		});
	} else if (query && query !== "" && type === "post") {
		posts = await Post.find({
			body: { $regex: query, $options: "i" },
		}).populate("user", "username");
	}
	res.render("search", { users, query, posts });
});
