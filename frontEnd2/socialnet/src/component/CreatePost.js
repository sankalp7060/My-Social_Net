import axios from "axios";
import React, { useState } from "react";
import Avatar from "react-avatar";
import { ImImages } from "react-icons/im";
import { POST_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {  getIsActive, getRefresh } from "../redux/postSlice";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const submitHandler = async () => {
    try {
      const res = await axios.post(
        `${POST_API_END_POINT}/create`,
        { description, id: user?._id },
        { withCredentials: true }
      );
      dispatch(getRefresh());
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setDescription("");
  };
  const forYouHandler = async () => {
    dispatch(getIsActive(true));
  };
  const followingHandler = async () => {
    dispatch(getIsActive(false));
  };
  return (
    <div className="w-[100%]">
      <div>
        <div className="flex items-center justify-evenly border-b border-gray-300">
          <div
            onClick={forYouHandler}
            className={`cursor-pointer w-full text-center px-4 py-3 ${isActive ? "bg-[#048193] text-white" : "hover:bg-[#5CC7D8] hover:text-white"}`}
          >
            <h1
              className={`${isActive ? "text-white":"text-black"} font-semibold text-lg`}
            >
              For You
            </h1>
          </div>
          <div
            onClick={followingHandler}
            className={`${
              !isActive
                ? "bg-[#048193] hover:bg-[#048193] "
                : "hover:bg-[#5CC7D8]"
            } cursor-pointer w-full text-center px-4 py-3`}
          >
            <h1
              className={`${
                !isActive ? "text-white" : "text-black"
              } font-semibold text-lg`}
            >
              Following
            </h1>
          </div>
        </div>
        <div>
          <div className="flex items-center p-4">
            <div>
              <Avatar
                src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                size="40"
                round={true}
              />
            </div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="outline-none border-none text-xl ml-2"
              type="text"
              placeholder="What is happening"
            />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div>
              <ImImages size="24px" />
            </div>
            <button
              onClick={submitHandler}
              className="bg-[#048193] px-4 py-1 border-none rounded-full text-lg text-white font-semibold"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
