const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const handleAsync = require('../utilities/handleAsync');

module.exports.editReplyForm = handleAsync(async (req, res) => {
    const { postId, commentId, replyId } = req.params;
    const post = await Post.findById(postId).populate('user', 'username');
    const comment = await Comment.findById(commentId).populate('user','username').populate({
        path: 'replies',
        populate: { path: 'user' }
    });
    console.log(comment)
    const { replies } = comment;
    const [reply] = replies.filter(el => el._id.toString() === replyId);
    res.render('replies/edit', { comment, post, reply });
})

module.exports.addReply = handleAsync(async (req, res) => {
    const { postId, commentId } = req.params;
    const { user_id } = req.session;
    const { body } = req.body;
    const user = await User.findById(user_id);
    const comment = await Comment.findById(commentId).populate('user','username');
    const reply = { body, date: new Date().toUTCString(), user };
    comment.replies.push(reply);
    await comment.save();
    req.flash('success', `Replied to ${comment.user.username}`);
    res.redirect(`/posts/show/${postId}`);
})

module.exports.deleteReply = handleAsync(async (req, res) => {
    const { postId, commentId, replyId } = req.params;
    const comment = await Comment.findByIdAndUpdate(commentId, { $pull: { replies: { _id: replyId } } } );
    await comment.save();
    req.flash('success','Reply deleted!');
    res.redirect(`/posts/show/${postId}`);
})

module.exports.editReply = handleAsync(async (req, res) => {
    const { postId, commentId, replyId } = req.params;
    const { body } = req.body;
    await Comment.findOneAndUpdate({ _id: commentId }, { $set: { 'replies.$[el].body': body } },
    {
        arrayFilters: [{ 'el._id': replyId }],
        new: true
    });
    req.flash('success','Edited reply!');
    res.redirect(`/posts/show/${postId}`);
})