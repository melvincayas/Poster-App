const express = require("express");
const router = express.Router();
const {
  validatePost,
  validateComment,
  validateReply,
  validateLoggedIn,
  isPostOwner,
  isCommentOwner,
  isReplyOwner,
} = require("../utilities/middleware/checkValidations");
const posts = require("../controllers/posts");
const comments = require("../controllers/comments");
const replies = require("../controllers/replies");

router
  .route("/")
  .get(posts.index)
  .post(validateLoggedIn, validatePost, posts.addPost);

router
  .route("/show/:id")
  .get(posts.showPost)
  .post(validateLoggedIn, validateComment, comments.addComment)
  .put(validateLoggedIn, isPostOwner, validatePost, posts.editPost)
  .delete(validateLoggedIn, isPostOwner, posts.deletePost);

router.get("/show/:id/edit", validateLoggedIn, isPostOwner, posts.editPostForm);

router
  .route("/show/:postId/:commentId")
  .get(validateLoggedIn, comments.showComment)
  .post(validateLoggedIn, validateReply, replies.addReply)
  .put(validateLoggedIn, isCommentOwner, validateComment, comments.editComment)
  .delete(validateLoggedIn, isCommentOwner, comments.deleteComment);

router.get(
  "/show/:postId/:commentId/edit",
  validateLoggedIn,
  isCommentOwner,
  comments.editCommentForm
);

router
  .route("/show/:postId/:commentId/:replyId")
  .put(validateLoggedIn, isReplyOwner, replies.editReply)
  .delete(validateLoggedIn, isReplyOwner, replies.deleteReply);

router.get(
  "/show/:postId/:commentId/:replyId/edit",
  validateLoggedIn,
  isReplyOwner,
  replies.editReplyForm
);

module.exports = router;
