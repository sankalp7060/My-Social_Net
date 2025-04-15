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
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
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
      .status(201)
      .cookie("token", token, { expiresIn: "1D", httpOnly: true })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
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
      const user = await User.findById(loggedInUserId);
      if (user.bookmark.includes(postId)) {
          await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmark: postId } });
          return res.status(200).json({
              message: "Removed from bookmarks."
          });
      } else {
          await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmark: postId } });
          return res.status(200).json({
              message: "Saved to bookmarks."
          });
      }
  } catch (error) {
      console.log(error);
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
    const otherUser = await User.find({_id:{$ne:id}}).select("-password");
    if (!otherUser) {
      return res.status(401).json({
        message: "Currently do not have users.",
      })
    };
    return res.status(200).json({
      otherUser
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

    if (!loggedInUser || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.followers.includes(loggedInUserId)) {
      return res.status(400).json({
        message: `You already follow ${user.name}`,
      });
    }

    await user.updateOne({ $push: { followers: loggedInUserId } });
    await loggedInUser.updateOne({ $push: { following: userId } });

    return res.status(200).json({
      message: `${loggedInUser.name} just followed ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.error("Error in follow controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed yet`,
      });
    }
    return res.status(200).json({
      message: `${(loggedInUser.name)} unfollow ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
