import React, { useState } from "react";
import Avatar from "react-avatar";
import { FaRegComment, FaRegBookmark } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { POST_API_END_POINT, timeSince } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/postSlice";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [likeCount, setLikeCount] = useState(post?.like?.length || 0);
  const [liked, setLiked] = useState(post?.like?.includes(user?._id));

  const likeHandler = async (id) => {
    try {
      const res = await axios.put(
        `${POST_API_END_POINT}/like/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
      console.log(error);
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

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex">
        <Avatar
          src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
          size="40"
          round={true}
        />
        <div className="ml-2 w-full">
          <div className="flex items-center">
            <h1 className="font-bold">{post?.userDetails[0]?.name}</h1>
            <p className="text-sm text-gray-500 ml-1">
              @{post?.userDetails[0]?.username} · {timeSince(post?.createdAt)}
            </p>
          </div>
          <p>{post?.description}</p>

          <div className="flex justify-between my-3">
            <div className="flex items-center">
              <div className="p-2 cursor-pointer hover:bg-[#EA76C4] rounded-full">
                <FaRegComment size="20px" />
              </div>
              <p>0</p>
            </div>

            <div className="flex items-center">
              <div
                onClick={() => likeHandler(post?._id)}
                className={`p-2 cursor-pointer rounded-full ${liked ? 'text-red-500' : 'hover:bg-[#EA76C4]'}`}
              >
                <GrLike size="20px" />
              </div>
              <p>{likeCount}</p>
            </div>

            <div className="flex items-center">
              <div className="p-2 cursor-pointer hover:bg-[#EA76C4] rounded-full">
                <FaRegBookmark size="20px" />
              </div>
              <p>0</p>
            </div>

            {user?._id === post?.userId && (
              <div
                onClick={() => deleteHandler(post?._id)}
                className="flex items-center cursor-pointer"
              >
                <div className="p-2 hover:bg-[#EA76C4] rounded-full">
                  <MdDeleteOutline size="20px" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;