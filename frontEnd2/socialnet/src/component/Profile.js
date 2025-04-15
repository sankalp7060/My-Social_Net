import React from "react";
import Avatar from "react-avatar";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetProfile from "../hooks/useGetProfile";
import { USER_API_END_POINT } from "../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/postSlice";
import { followingUpdate } from "../redux/userSlice";

const Profile = () => {
  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  useGetProfile(id);

  const followOrUnfollowHandler = async () => {
    try {
      const endpoint = user.following.includes(id) ? "unfollow" : "follow";
      const res = await axios.post(
        `${USER_API_END_POINT}/${endpoint}/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      dispatch(followingUpdate(id));
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };
  return (
    <div className="w-[50%] border-l border-r border-gray-300">
      <div>
        <div className="flex items-center py-2">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-[#5CC7D8] cursor-pointer"
          >
            <IoArrowBackOutline size="24px" />
          </Link>
          <div className="ml-2">
            <h1 className="font-bold text-lg">{profile?.name}</h1>
            <p className="text-sm text-gray-500">10 post</p>
          </div>
        </div>
        <img
          src="https://wallpapers.com/images/hd/technology-linkedin-background-dnic4b0thk1hgfm2.jpg"
          alt="banner"
        />
        <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
          <Avatar
            src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
            size="120"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          {profile?._id === user?._id ? (
            <button className="px-4 py-1 bg-[#048193] rounded-full text-white font-bold">
              Edit Profile
            </button>
          ) : (
            <button
              onClick={followOrUnfollowHandler}
              className="px-4 py-1 bg-[#048193] rounded-full text-white font-bold"
            >
              {user.following.includes(id)} ? "Following" : "Follow"
            </button>
          )}
        </div>
        <div className="m-4">
          <h1 className="font-bold text-xl">{profile?.name}</h1>
          <p>{`@${profile?.username}`}</p>
        </div>
        <div>
          <p className="m-4 text-sm">I am a Btech computer science engineer</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
