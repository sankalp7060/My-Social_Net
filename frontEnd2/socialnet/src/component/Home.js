import React, { useEffect } from "react";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import { Outlet, useNavigate } from "react-router-dom";
import useOtherUser from "../hooks/useOtherUser";
import { useSelector } from "react-redux";
import useGetPost from "../hooks/useGetPost";
const Home = () => {
  const { user, otherUsers } = useSelector((store) => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user,navigate]);
  useOtherUser(user?._id);
  useGetPost(user?._id);
  return (
    <div className="flex justify-between w-[80%] mx-auto">
      <LeftBar /> 
      <Outlet /> 
      <RightBar otherUsers={otherUsers} />
    </div>
  );
};
export default Home;
