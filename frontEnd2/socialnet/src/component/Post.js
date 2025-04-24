import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { FaRegComment, FaRegBookmark } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { POST_API_END_POINT, timeSince } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/postSlice";

const formatUsername = (username) => {
  if (!username) return "";
  return username.startsWith("@") ? username : `@${username}`;
};

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [likeCount, setLikeCount] = useState(post?.like?.length || 0);
  const [liked, setLiked] = useState(post?.like?.includes(user?._id));
  const [isTextareaVisible, setTextareaVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;

  useEffect(() => {
    if (isTextareaVisible) {
      fetchComments(post?._id);
    }
  }, [isTextareaVisible, post?._id]);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/comments/${postId}`, {
        withCredentials: true,
      });
      setComments(res.data);
      setCommentCount(res.data.length);
    } catch (error) {
      toast.error("Failed to fetch comments");
      console.log(error);
    }
  };

  const likeHandler = async (id) => {
    const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setLiked(!liked);

    try {
      const res = await axios.put(
        `${POST_API_END_POINT}/like/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (error) {
      setLikeCount(likeCount);
      setLiked(liked);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete(`${POST_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
      console.log(error);
    }
  };

  const deleteCommentHandler = async (commentId) => {
    try {
      const res = await axios.delete(
        `${POST_API_END_POINT}/comment/${post._id}/${commentId}`,
        {
          data: { userId: user._id },
          withCredentials: true,
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentCount((prev) => prev - 1);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
      console.log(error);
    }
  };

  const toggleTextareaVisibility = (e) => {
    if (e) e.preventDefault();
    setTextareaVisible(!isTextareaVisible);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please write a comment before submitting.");
      return;
    }

    try {
      await axios.put(
        `${POST_API_END_POINT}/comment/${post?._id}`,
        { text: commentText, userId: user?._id },
        { withCredentials: true }
      );

      setCommentText("");
      setCommentCount((prev) => prev + 1);
      const newComment = {
        _id: Date.now().toString(),
        text: commentText,
        userId: user,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [newComment, ...prev]);
      await fetchComments(post?._id);
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const isLong = post?.description?.length > maxLength;
  const shortDescription = post?.description?.slice(0, maxLength);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex">
        <div className="flex-shrink-0"> 
          <Avatar
            src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
            size="40"
            round={true}
          />
        </div>
        <div className="ml-2 w-full">
          <div className="flex items-center">
            <h1 className="font-bold">{post?.userDetails[0]?.name}</h1>
            <p className="text-sm text-gray-500 ml-1">
              {formatUsername(post?.userDetails[0]?.username)} ·{" "}
              {timeSince(post?.createdAt)}
            </p>
          </div>

          <p className="mt-1">
            {expanded || !isLong ? post?.description : `${shortDescription}...`}
            {isLong && (
              <span
                onClick={toggleExpand}
                className="text-[#048193] cursor-pointer ml-2 font-semibold"
              >
                {expanded ? "See Less" : "See More"}
              </span>
            )}
          </p>

          <div className="flex justify-between my-3">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleTextareaVisibility}
                className={`p-2 rounded-full ${
                  isTextareaVisible ? "text-[#048193]" : "hover:text-[#048193]"
                }`}
              >
                <FaRegComment size="20px" />
              </button>
              <p>{commentCount}</p>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => likeHandler(post?._id)}
                className={`p-2 rounded-full ${
                  liked ? "text-[#048193]" : "hover:text-[#048193]"
                }`}
              >
                <GrLike size="20px" />
              </button>
              <p>{likeCount}</p>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                className="p-2 hover:text-[#048193] rounded-full"
              >
                <FaRegBookmark size="20px" />
              </button>
              <p>0</p>
            </div>

            {user?._id === post?.userId && (
              <button
                type="button"
                onClick={() => deleteHandler(post?._id)}
                className="flex items-center"
              >
                <div className="p-2 relative bottom-[2px] hover:text-red-400 hover:rounded-full">
                  <MdDeleteOutline size="24px" />
                </div>
              </button>
            )}
          </div>

          {isTextareaVisible && (
            <form onSubmit={handleCommentSubmit}>
              <div className="mt-2">
                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="mt-2 p-2 bg-[#048193] hover:bg-[#3A9DA8] text-white font-semibold rounded-full"
                >
                  Comment
                </button>
              </div>
            </form>
          )}

          {isTextareaVisible && comments.length > 0 && (
            <div className="mt-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-2 border-b border-gray-200 flex justify-between items-start"
                >
                  <div className="flex items-start">
                    <Avatar
                      src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                      size="30"
                      round={true}
                    />
                    <div className="ml-2">
                      <p className="text-sm font-bold">
                        {comment.userId.name}
                        <span className="text-gray-500 font-normal ml-2 text-xs">
                          · {timeSince(comment.createdAt)}
                        </span>
                      </p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                  {comment.userId._id === user._id && (
                    <button
                      type="button"
                      onClick={() => deleteCommentHandler(comment._id)}
                      className="mt-2 p-2 hover:text-red-400 hover:rounded-full"
                    >
                      <MdDeleteOutline size="18" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
