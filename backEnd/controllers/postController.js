import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";

export const createPost = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: "Fields are required.",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    await Post.create({
      description,
      userId: id,
      userDetails: user,
    });
    return res.status(201).json({
      message: "Post created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const dltPost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Post deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const like = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.like.includes(loggedInUserId)) {
      await Post.findByIdAndUpdate(postId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({
        message: "User unliked your post.",
      });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { like: loggedInUserId } });
      return res.status(200).json({
        message: "User liked your post.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const getAllPost = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserPosts = await Post.find({ userId: id });
    const followingUserPost = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Post.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      posts: loggedInUserPosts.concat(...followingUserPost),
    });
  } catch (error) {
    console.log(error);
  }
};
export const getFollowingPost = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserPost = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Post.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      posts: [].concat(...followingUserPost),
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const postId = req.params.id;
    if (!text || !userId) {
      return res.status(400).json({ message: "Text and UserId are required" });
    }
    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      userId: user._id,
      text,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    await post.save();
    res.status(200).json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "comments.userId",
      "name username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex(
      (comment) =>
        comment._id.toString() === commentId &&
        comment.userId.toString() === userId
    );
    if (commentIndex === -1) {
      return res
        .status(403)
        .json({ message: "You cannot delete this comment" });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
