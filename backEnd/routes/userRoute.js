import express from "express";
import isAuthenticated from "../config/authentication.js";
import {
  Register,
  login,
  logOut,
  bookmark,
  getMyProfile,
  getOtherUsers,
  follow,
  unfollow,
  searchUsers,
  updateProfile,
  getBookmarkedPosts
} from "../controllers/userController.js";

const router = express.Router();
router.post("/register", Register);
router.post("/login", login);
router.get("/logout", logOut);

router.get("/profile/:id", isAuthenticated, getMyProfile);
router.get("/otheruser/:id", isAuthenticated, getOtherUsers);
router.get("/search", isAuthenticated, searchUsers);
router.put("/update/:id", isAuthenticated, updateProfile);
router.post("/follow/:id", isAuthenticated, follow);
router.post("/unfollow/:id", isAuthenticated, unfollow);
router.put("/bookmark/:id", isAuthenticated, bookmark);
router.get("/bookmarks", isAuthenticated, getBookmarkedPosts);

export default router;
