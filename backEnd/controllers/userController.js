import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exist",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 16);
    await User.create({
      name,
      username,
      email,
      password: hashPassword,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email/username or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email/username or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1D",
    });

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const logOut = async (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "User logged out successfully.",
    success: true,
  });
};
export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;

    if (!loggedInUserId || !postId) {
      return res.status(400).json({
        message: "User ID and Post ID are required",
      });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.bookmark.includes(postId)) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmark: postId },
      });
      return res.status(200).json({
        message: "Removed from bookmarks",
      });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmark: postId },
      });
      return res.status(200).json({
        message: "Saved to bookmarks",
      });
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUser = await User.find({ _id: { $ne: id } }).select("-password");
    if (!otherUser) {
      return res.status(401).json({
        message: "Currently do not have users.",
      });
    }
    return res.status(200).json({
      otherUser,
    });
  } catch (error) {
    console.log(error);
  }
};
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} just followed ${user.name}`,
      success: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    await user.updateOne({ $pull: { followers: loggedInUserId } });
    await loggedInUser.updateOne({ $pull: { following: userId } });
    return res.status(200).json({
      message: `${loggedInUser.name} unfollowed ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        message: "Query parameter is required",
        success: false,
      });
    }
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    }).select("name username email");
    return res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, banner } = req.body;
    const userId = req.params.id;

    if (!name && !bio) {
      return res.status(400).json({ message: "Name or bio is required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(bio && { bio }),
          ...(avatar && { avatar }),
          ...(banner && { banner }),
        },
      },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookmarkedPosts = async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user._id); 
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmark',
        populate: [{
          path: 'userId',
          select: 'name username avatar'
        }, {
          path: 'likes',
          select: 'username'
        }]
      })
      .lean(); 
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      bookmarkedPosts: user.bookmark || []
    });

  } catch (error) {
    console.error("FULL ERROR STACK:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};