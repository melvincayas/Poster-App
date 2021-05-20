const express = require("express");
const router = express.Router();
const {
	validateLoggedIn,
} = require("../utilities/middleware/checkValidations");
const user = require("../controllers/user");

router
	.route("/:username")
	.get(user.userHomePage)
	.post(validateLoggedIn, user.followUser);

router.get("/:username/followers", user.showFollowers);

router.get("/:username/following", user.showFollowing);

router.get("/:username/bookmarks", validateLoggedIn, user.showBookmarked);

module.exports = router;
