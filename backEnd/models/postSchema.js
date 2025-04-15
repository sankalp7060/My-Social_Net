import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    dislike: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      extended: true,
    },
    userDetails:{
      type:Array,
      default:[]
    },
  },
  { timestamps: true }
);
export const Post = mongoose.model("Post", postSchema);