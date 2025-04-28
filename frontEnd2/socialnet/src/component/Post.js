import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { GrLike, GrDislike } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import {
  POST_API_END_POINT,
  USER_API_END_POINT,
  timeSince,
} from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/postSlice";
import { toggleBookmark as toggleBookmarkAction } from "../redux/userSlice";

const formatUsername = (username) => {
  if (!username) return "";
  return username.startsWith("@") ? username : `@${username}`;
};

const Post = ({ post }) => {
  const { user, userMap = {} } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [isTextareaVisible, setTextareaVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
  const [expandedPost, setExpandedPost] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [bookmarked, setBookmarked] = useState(
    user?.bookmark?.includes(post?._id)
  );
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const maxLength = 200;

  const postUser = userMap[post?.userId] || post?.userDetails?.[0] || {};

  useEffect(() => {
    if (isTextareaVisible && post?._id) {
      fetchComments(post._id);
    }
  }, [isTextareaVisible, post?._id]);

  useEffect(() => {
    setBookmarked(user?.bookmark?.includes(post?._id));
  }, [user?.bookmark, post?._id]);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/comments/${postId}`, {
        withCredentials: true,
      });
      setComments(res.data || []);
      setCommentCount(res.data?.length || 0);
    } catch (error) {
      showErrorToast("Failed to fetch comments");
      console.error(error);
    }
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      duration: 2000,
      style: {
        background: "#f0fdf4",
        color: "#166534",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      duration: 3000,
      style: {
        background: "#fef2f2",
        color: "#b91c1c",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  const likeHandler = async (postId) => {
    if (!postId || !user?._id) return;
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

    try {
      const response = await axios.put(
        `${POST_API_END_POINT}/like/${postId}`,
        { id: user._id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setLikeCount(response.data.likeCount);
      setLiked(response.data.liked);

      showSuccessToast(response.data.liked ? "Post liked!" : "Post unliked");
    } catch (error) {
      setLiked(!newLikedState);
      setLikeCount(newLikedState ? likeCount - 1 : likeCount + 1);

      showErrorToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to update like status"
      );

      console.error("Like error:", {
        error: error.response?.data || error.message,
        postId,
        userId: user?._id,
      });
    }
  };

  const deleteHandler = async (id) => {
    if (!id) return;

    try {
      await axios.delete(`${POST_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      dispatch(getRefresh());
      showSuccessToast("Post deleted successfully");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error deleting post");
      console.error(error);
    }
  };

  const deleteCommentHandler = async (commentId) => {
    if (!commentId || !post?._id || !user?._id) return;

    try {
      await axios.delete(
        `${POST_API_END_POINT}/comment/${post._id}/${commentId}`,
        {
          data: { userId: user._id },
          withCredentials: true,
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentCount((prev) => prev - 1);
      showSuccessToast("Comment deleted");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to delete comment"
      );
      console.error(error);
    }
  };

  const toggleTextareaVisibility = (e) => {
    e?.preventDefault();
    setTextareaVisible(!isTextareaVisible);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !post?._id || !user?._id) {
      showErrorToast("Please write a valid comment");
      return;
    }

    try {
      await axios.put(
        `${POST_API_END_POINT}/comment/${post._id}`,
        { text: commentText, userId: user._id },
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
      await fetchComments(post._id);
      showSuccessToast("Comment added successfully!");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to add comment");
      console.error(error);
    }
  };

  const togglePostExpand = () => {
    setExpandedPost(!expandedPost);
  };

  const toggleCommentExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleBookmark = async (e) => {
    e.preventDefault();
    if (isBookmarkLoading || !post?._id || !user?._id) return;

    setIsBookmarkLoading(true);
    const wasBookmarked = bookmarked;
    const newBookmarkedState = !wasBookmarked;

    try {
      setBookmarked(newBookmarkedState);
      dispatch(toggleBookmarkAction(post._id));

      await axios.put(
        `${USER_API_END_POINT}/bookmark/${post._id}`,
        { id: user._id },
        { withCredentials: true }
      );
      showSuccessToast(
        newBookmarkedState ? "Added to bookmarks" : "Removed from bookmarks"
      );
    } catch (error) {
      console.error("Bookmark error:", error);
      setBookmarked(wasBookmarked);
      dispatch(toggleBookmarkAction(post._id));
      showErrorToast(
        error.response?.data?.message || "Failed to update bookmark"
      );
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const isPostLong = post?.description?.length > maxLength;
  const shortPostDescription = post?.description?.slice(0, maxLength);

  return (
    <div className="border-b border-gray-200 p-4 w-full hover:bg-gray-50 transition-colors duration-150">
      <div className="flex w-full">
        <div className="flex-shrink-0">
          <Avatar
            src={
              postUser?.avatar ||
              "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
            }
            size="40"
            round={true}
            className="border-2 border-white shadow-sm"
          />
        </div>
        <div className="ml-3 w-full overflow-hidden">
          <div className="flex items-center">
            <h1 className="font-bold text-gray-800 hover:text-[#048193] cursor-pointer">
              {postUser?.name || "Unknown User"}
            </h1>
            {postUser?.username && (
              <p className="text-sm text-gray-500 ml-1">
                {formatUsername(postUser.username)} ·{" "}
                <span className="hover:underline cursor-pointer">
                  {timeSince(post?.createdAt)}
                </span>
              </p>
            )}
          </div>

          {post?.description && (
            <p className="mt-2 text-gray-700 break-words">
              {expandedPost || !isPostLong
                ? post.description
                : `${shortPostDescription}...`}
              {isPostLong && (
                <span
                  onClick={togglePostExpand}
                  className="text-[#048193] cursor-pointer ml-2 font-semibold whitespace-nowrap hover:underline"
                >
                  {expandedPost ? "Show less" : "Show more"}
                </span>
              )}
            </p>
          )}

          <div className="flex justify-between my-3 max-w-md">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={toggleTextareaVisibility}
                className={`p-2 rounded-full hover:bg-blue-50 ${
                  isTextareaVisible ? "text-[#048193] bg-blue-50" : ""
                } transition-colors duration-200`}
                aria-label="Comment"
              >
                <FaRegComment size="18px" />
              </button>
              <span className="text-sm mb-[3px]">{commentCount}</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => {
                  likeHandler(post?._id);
                }}
                className={`p-2 rounded-full hover:bg-red-50 ${
                  liked ? "text-[#048193] bg-red-50" : ""
                } transition-colors duration-200`}
                aria-label="Like"
              >
                {liked ? <GrLike size="18px" /> : <GrDislike size="18px" />}
              </button>
              <span className={`${liked ? "text-sm" : "text-sm mb-[10px]"}`}>
                {likeCount}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={toggleBookmark}
                disabled={isBookmarkLoading}
                className={`p-2 rounded-full hover:bg-yellow-50 ${
                  bookmarked ? "text-yellow-500 bg-yellow-50" : ""
                } transition-colors duration-200`}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarked ? (
                  <FaBookmark size="18px" />
                ) : (
                  <FaRegBookmark size="18px" />
                )}
              </button>
            </div>

            {user?._id === post?.userId && (
              <button
                type="button"
                onClick={() => deleteHandler(post?._id)}
                className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                aria-label="Delete"
              >
                <MdDeleteOutline size="23px" />
              </button>
            )}
          </div>

          {isTextareaVisible && (
            <form onSubmit={handleCommentSubmit} className="w-full mt-2">
              <div className="w-full">
                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#048193] focus:border-transparent transition-all duration-200"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      commentText.trim()
                        ? "bg-[#048193] hover:bg-[#3A9DA8] text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    } transition-colors duration-200`}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>
          )}

          {isTextareaVisible && comments.length > 0 && (
            <div className="mt-4 space-y-3 w-full">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Comments ({commentCount})
              </h3>
              {comments.map((comment) => {
                const commentUser =
                  userMap[comment.userId?._id] || comment.userId || {};
                const isCommentLong = comment.text?.length > maxLength;
                const shortComment = comment.text?.slice(0, maxLength);
                const isExpanded = expandedComments[comment._id] || false;

                return (
                  <div
                    key={comment._id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 w-full hover:bg-white transition-colors duration-150"
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex w-full max-w-[calc(100%-24px)]">
                        <Avatar
                          src={
                            commentUser?.avatar ||
                            "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                          }
                          size="32"
                          round={true}
                          className="flex-shrink-0 border-2 border-white shadow-sm"
                        />
                        <div className="ml-3 w-full min-w-0">
                          <div className="flex items-center">
                            <p className="font-semibold text-sm text-gray-800 hover:text-[#048193] cursor-pointer">
                              {commentUser?.name || "Unknown User"}
                            </p>
                            {comment.createdAt && (
                              <span className="text-gray-500 text-xs ml-2 hover:underline cursor-pointer">
                                {timeSince(comment.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 break-words w-full">
                            <p className="text-sm text-gray-700">
                              {isExpanded || !isCommentLong
                                ? comment.text
                                : `${shortComment}...`}
                              {isCommentLong && (
                                <span
                                  onClick={() =>
                                    toggleCommentExpand(comment._id)
                                  }
                                  className="text-[#048193] cursor-pointer ml-2 font-semibold whitespace-nowrap hover:underline"
                                >
                                  {isExpanded ? "Show less" : "Show more"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      {comment.userId?._id === user?._id && (
                        <button
                          onClick={() => deleteCommentHandler(comment._id)}
                          className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                          aria-label="Delete comment"
                        >
                          <MdDeleteOutline size="18" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
