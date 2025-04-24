import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { ImImages } from "react-icons/im";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { getRefresh } from "../redux/postSlice";

const CreatePostInput = () => {
  const [description, setDescription] = useState("");
  const textareaRef = useRef(null);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  const handlePostSubmit = async () => {
    try {
      if (!description.trim()) return;

      const res = await axios.post(
        `${POST_API_END_POINT}/create`,
        { description, id: user?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(getRefresh());
      if (res.data.success) {
        toast.success(res.data.message);
      }
      setDescription("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="border-b border-gray-300">
      <div className="flex items-start p-4">
        <div className="mt-1">
          <Avatar
            src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
            size="40"
            round={true}
          />
        </div>
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="outline-none border-none text-xl ml-2 mt-2 w-full resize-none overflow-hidden"
          placeholder="What is happening"
          rows="1"
          style={{ minHeight: "50px" }}
        />
      </div>
      <div className="flex items-center justify-between ml-2 p-4">
        <div>
          <ImImages size="28px" className="cursor-pointer" />
        </div>
        <button
          onClick={handlePostSubmit}
          disabled={!description.trim()}
          className="bg-[#048193] px-4 py-1 border-none hover:bg-[#3A9DA8] rounded-full text-lg text-white font-semibold"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostInput;
