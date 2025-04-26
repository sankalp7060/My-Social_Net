import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";
import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export const createPost = async (req, res) => {
  try {
    const { description, id } = req.body;
    const files = req.files?.images;
    
    if (!description && (!files || files.length === 0)) {
      return res.status(401).json({
        message: "Post cannot be empty.",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    let imageUrls = [];
    if (files) {
      const uploadPromises = files.map(file => 
        cloudinary.v2.uploader.upload(file.path, {
          folder: 'social_media/posts'
        })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);
    }

    await Post.create({
      description,
      userId: id,
      userDetails: user,
      images: imageUrls
    });

    return res.status(201).json({
      message: "Post created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error creating post",
      success: false
    });
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
    const { id: userId } = req.body;
    const postId = req.params.id;

    // Basic validation
    if (!userId || !postId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing user ID or post ID" 
      });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: "Post not found" 
      });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.indexOf(userId);
    const isLiked = likeIndex !== -1;

    // Update likes array
    if (isLiked) {
      post.likes.splice(likeIndex, 1); // Remove like
    } else {
      post.likes.push(userId); // Add like
    }

    // Save changes
    const updatedPost = await post.save();

    return res.status(200).json({
      success: true,
      liked: !isLiked,
      likes: updatedPost.likes,
      likeCount: updatedPost.likes.length
    });

  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
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
