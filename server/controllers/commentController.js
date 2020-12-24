const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const CommentLike = mongoose.model("CommentLike");
const CommentReply = mongoose.model("Reply");
const Notification = mongoose.model("Notification");
const CommentReplyLike = mongoose.model("CommentReplyLike");
const User = mongoose.model("User");
const notificationHandler = require("../handlers/notificationHandler");
const linkify = require("linkifyjs");
require("linkifyjs/plugins/hashtag")(linkify);
require("linkifyjs/plugins/mention")(linkify);

function arrayRemove(array, value) {
  return array.filter(item => {
    return item._id.toString() !== value.toString();
  });
}

exports.addComment = (req, res) => {
  //notificationHandler.sendCommentMentionNotification(req, values);

  // TODO:
  // const mentions = linkify // find mentions
  //   .find(req.body.value)
  //   .filter(link => {
  //     if (link.type === "mention") {
  //       return link.value.substring(1);
  //     }
  //   })
  //   .map(hashtag => hashtag.value.substring(1));

  // const uniqueUsernames = [...new Set([...mentions])];

  Post.findById({ _id: req.body.postId })
    .then(post => {
      if (!post) {
        return res.status(400).json({ message: "No post with that id" });
      }
      new Comment({
        post: post._id,
        author: req.userData.userId,
        text: req.body.value
      })
        .save()
        .then(comment => {
          comment.populate("author", err => {
            if (err) {
              return res.status(400).json({ message: err.message });
            }
            let notification;

            if (req.userData.userId !== req.body.authorId) {
              notification = new Notification({
                sender: req.userData.userId,
                receiver: req.body.authorId,
                post: req.body.postId,
                comment: comment._id,
                type: "post_comment"
              })
                .save()
                .then(notification => {
                  return notification
                    .populate("comment", "text")
                    .populate("post", "photo")
                    .execPopulate();
                })
                .then(notification => {
                  return notification.toObject();
                });
            }
         // TODO:
};

exports.getCommentsForPost = (req, res) => {
  // TODO:
};

exports.addCommentReply = (req, res) => {
  // TODO:
};

exports.getRepliesForComment = (req, res) => {
 // TODO:
};

exports.likeComment = (req, res) => {
 
  // TODO:
};

exports.likeCommentReply = (req, res) => {
  CommentReplyLike.updateOne(
  // TODO:
  });
};

exports.getCommentLikes = (req, res) => {
// TODO:
};

