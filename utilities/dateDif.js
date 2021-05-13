module.exports = date => {
	const now = new Date();
	const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);
	const weeks = Math.round(days / 7);
	const months = Math.round(weeks / 4);
	const years = Math.round(months / 12);

	if (seconds <= 59) {
		if (seconds === 1) return `${seconds} second ago`;
		return `${seconds} seconds ago`;
	}

	if (minutes <= 59) {
		if (minutes === 1) return `${minutes} minute ago`;
		return `${minutes} minutes ago`;
	}

	if (hours <= 23) {
		if (hours === 1) return `${hours} hour ago`;
		return `${hours} hours ago`;
	}

	if (days <= 6) {
		if (days === 1) return `${days} day ago`;
		return `${days} days ago`;
	}

	if (weeks <= 3) {
		if (weeks === 1) return `${weeks} week ago`;
		return `${weeks} weeks ago`;
	}

	if (months <= 11) {
		if (months === 1) return `${months} month ago`;
		return `${months} months ago`;
	}

	if (years === 1) return `${years} year ago`;
	return `${years} years ago`;
};
