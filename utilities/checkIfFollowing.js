module.exports = (userRequested, userSurfing, surferId) => {
	if (surferId && userSurfing.following.includes(userRequested._id)) {
		return true;
	} else {
		return false;
	}
};
