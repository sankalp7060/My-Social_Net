import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive } from "../redux/postSlice";

const FeedTabs = () => {
  const dispatch = useDispatch();
  const { isActive } = useSelector((store) => store.post);

  const forYouHandler = () => {
    dispatch(getIsActive(true));
  };

  const followingHandler = () => {
    dispatch(getIsActive(false));
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="shadow-md flex items-center justify-evenly border-b border-gray-300">
        <div
          onClick={forYouHandler}
          className={`cursor-pointer w-full text-center px-4 py-3 ${
            isActive
              ? "bg-[#048193] text-white"
              : "hover:bg-[#5CC7D8] hover:text-white"
          }`}
        >
          <h1 className={`${isActive ? "text-white" : "text-black"} font-semibold text-lg`}>
            For You
          </h1>
        </div>
        <div
          onClick={followingHandler}
          className={`${
            !isActive
              ? "bg-[#048193] hover:bg-[#048193]"
              : "hover:bg-[#5CC7D8]"
          } cursor-pointer w-full text-center px-4 py-3`}
        >
          <h1 className={`${!isActive ? "text-white" : "text-black"} font-semibold text-lg`}>
            Following
          </h1>
        </div>
      </div>
    </div>
  );
};

export default FeedTabs;