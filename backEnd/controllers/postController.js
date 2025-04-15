import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";

export const createPost = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(400).json({
        message: "Description and user ID are required",
        success: false,
      });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    await Post.create({
      description,
      userId: id,
      userDetails: user,
    });

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const dltPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const like = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const isLiked = post.like.includes(loggedInUserId);

    await Post.findByIdAndUpdate(postId, {
      [isLiked ? "$pull" : "$push"]: { like: loggedInUserId },
    });

    return res.status(200).json({
      message: isLiked ? "User disliked the post." : "User liked the post.",
      success: true,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    const loggedInUserPost = await Post.find({ userId: id });
    const followingUserPosts = await Post.find({ userId: { $in: loggedInUser.following } });
    return res.status(200).json({
      posts: [...loggedInUserPost, ...followingUserPosts],
      success: true,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const followingUserPosts = await Post.find({ userId: { $in: loggedInUser.following } });

    return res.status(200).json({
      posts: followingUserPosts,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
