import isAuthenticated from "../config/authentication.js";
import {
  createPost,
  dltPost,
  getAllPost,
  getFollowingPost,
  like,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/postController.js";
import express from "express";
const router = express.Router();
router.route("/create").post(isAuthenticated, createPost);
router.route("/delete/:id").delete(dltPost);
router.route("/like/:id").put(isAuthenticated, like);
router.route("/comment/:id").put(isAuthenticated, addComment);
router.route("/comments/:id").get(isAuthenticated, getComments);
router.route("/comment/:id/:commentId").delete(isAuthenticated, deleteComment);
router.route("/allPost/:id").get(isAuthenticated, getAllPost);
router.route("/followingPost/:id").get(isAuthenticated, getFollowingPost);
export default router;
