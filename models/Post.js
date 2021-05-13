const mongoose = require("mongoose");
const { Schema } = mongoose;
const dateDif = require("../utilities/dateDif");

const postSchema = new Schema({
	body: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

postSchema.post("init", doc => {
	return (doc.dateDif = dateDif(doc.date));
});

postSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await mongoose.model("Comment").deleteMany({ post: doc._id });
		// deletes every comment with post ID
		await mongoose
			.model("User")
			.updateOne({ posts: doc._id }, { $pull: { posts: doc._id } });
		// deletes post from PostOwner
		await mongoose
			.model("User")
			.updateMany(
				{ comments: { $in: doc.comments } },
				{ $pull: { comments: { $in: doc.comments } } }
			);
		// deletes every comment from every user from this post
	}
});

module.exports = mongoose.model("Post", postSchema);
