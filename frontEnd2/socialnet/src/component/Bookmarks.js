import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import Post from "./Post";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";

const Bookmarks = () => {
  const { user } = useSelector((store) => store.user);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!user?._id) {
          return;
        }
        const { data } = await axios.get(`${USER_API_END_POINT}/bookmarks`, {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (data.success) {
          setBookmarkedPosts(data.bookmarkedPosts || []);
        } else {
          throw new Error(data.message || "Failed to fetch bookmarks");
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error(
          error.response?.data?.message || "Failed to load saved posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold">Your Saved Posts</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#048193]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">Your Saved Posts</h1>
      </div>

      {bookmarkedPosts.length > 0 ? (
        <div className="space-y-6">
          {bookmarkedPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
          <FiBookmark className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No saved posts yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            When you save posts, they'll appear here for easy access later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;