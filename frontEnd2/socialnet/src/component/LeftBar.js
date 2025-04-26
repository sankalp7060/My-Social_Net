import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import {
  MdOutlineExplore,
  MdOutlineNotifications,
  MdFavoriteBorder,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, getUser } from "../redux/userSlice";

const LeftBar = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      navigate("/login");
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      dispatch(getUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Logout failed! Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-[20%] p-3 sticky top-0 h-[100vh] overflow-y-auto">
      <div className="flex items-center mb-4">
        <img width="50px" src="/titlelogo2.png" alt="Main logo" />
        <h1 className="ml-2 text-3xl font-bold text-[#048193]">Velfy</h1>
      </div>
      <nav>
        <Link
          to="/"
          className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer"
        >
          <HiOutlineHome size="24px" aria-label="Home" />
          <h1 className="font-bold text-lg ml-2">Home</h1>
        </Link>
        <div className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer">
          <MdOutlineExplore size="24px" aria-label="Explore" />
          <h1 className="font-bold text-lg ml-2">Explore</h1>
        </div>
        <div className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer">
          <MdOutlineNotifications size="24px" aria-label="Notifications" />
          <h1 className="font-bold text-lg ml-2">Notifications</h1>
        </div>
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer"
        >
          <CgProfile size="24px" aria-label="Profile" />
          <h1 className="font-bold text-lg ml-2">Profile</h1>
        </Link>
        <Link
          to="/bookmarks"
          className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer"
        >
          <MdFavoriteBorder size="24px" aria-label="Favorite" />
          <h1 className="font-bold text-lg ml-2">Saved Posts</h1>
        </Link>
        <div
          onClick={logoutHandler}
          className="flex items-center my-2 p-3 hover:bg-[#5CC7D8] rounded-full cursor-pointer"
        >
          <FiLogOut size="24px" aria-label="Logout" />
          <h1 className="font-bold text-lg ml-2">Logout</h1>
        </div>
      </nav>
    </div>
  );
};

export default LeftBar;
