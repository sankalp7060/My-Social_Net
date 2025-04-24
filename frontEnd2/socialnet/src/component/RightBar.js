import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const RightBar = ({ otherUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(otherUsers || []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(otherUsers);
    } else {
      const lowerSearch = searchTerm.toLowerCase().replace(/^@/, "");
      const filtered = otherUsers.filter(
        (user) =>
          user?.name?.toLowerCase().includes(lowerSearch) ||
          user?.username?.toLowerCase().includes(lowerSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, otherUsers]);
  const formatUsername = (username) => {
    if (!username) return "";
    return username.startsWith("@") ? username : `@${username}`;
  };

  return (
    <div className="w-[25%] sticky top-0 h-[100vh] overflow-y-auto">
      <div className="mt-3 flex items-center p-2 hover:bg-[#3A9DA8] text-white bg-[#0AA2B3] rounded-full outline-none">
        <MdSearch size="24px" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0AA2B3] outline-none px-1 w-full placeholder:text-white font-semibold"
          placeholder="Search"
        />
      </div>
      <div className="p-4 bg-[#0AA2B3] my-4 rounded-2xl">
        <h1 className="font-bold text-lg text-white">Suggestions</h1>
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between my-3"
            >
              <div className="flex">
                <Avatar
                  src={
                    user?.avatar ||
                    "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                  }
                  size="40"
                  round={true}
                />
                <div className="ml-2">
                  <h1 className="font-bold text-white">{user?.name}</h1>
                  <p className="text-sm text-white">
                    {formatUsername(user?.username)}
                  </p>
                </div>
              </div>
              <Link to={`/profile/${user?._id}`}>
                <button className="px-4 py-1 bg-[#048193] hover:bg-[#3A9DA8] rounded-full font text-white">
                  Profile
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white mt-3">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default RightBar;
