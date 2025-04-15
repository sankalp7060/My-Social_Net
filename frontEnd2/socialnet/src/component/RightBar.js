import React from "react";
import Avatar from "react-avatar";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const RightBar = ({ otherUsers }) => {
  return (
    <div className="w-[25%]">
      <div className="mt-3 flex items-center p-2 text-white bg-[#0AA2B3] rounded-full outline-none">
        <MdSearch size="24px" />
        <input
          type="text"
          className="bg-[#0AA2B3] outline-none px-1 w-full placeholder:text-white font-semibold"
          placeholder="Search"
        />
      </div>
      <div className="p-4 bg-[#0AA2B3] my-4 rounded-2xl">
        <h1 className="font-bold text-lg text-white">Suggestions</h1>
        {otherUsers?.map((user) => {
          return (
            <div
              key={user?._id}
              className="flex items-center justify-between my-3"
            >
              <div className="flex">
                <div>
                  <Avatar
                    src="https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                    size="40"
                    round={true}
                  />
                </div>
                <div className="ml-2">
                  <h1 className="font-bold text-white">{user?.name}</h1>
                  <p className="text-sm text-white">{`@${user?.username}`}</p>
                </div>
              </div>
              <div>
                <Link to={`/profile/${user?._id}`}>
                  <button className="px-4 py-1 bg-[#048193] rounded-full font text-white">
                    Follow
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightBar;
