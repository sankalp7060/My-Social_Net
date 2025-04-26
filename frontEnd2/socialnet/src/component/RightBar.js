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
    <div className="w-[29%] sticky top-0 h-[100vh] overflow-y-auto">
      <div className="mt-4 mx-4 flex items-center p-3 hover:bg-[#3A9DA8] text-white bg-[#0AA2B3] rounded-full">
        <MdSearch size="24px" className="ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none px-3 w-full placeholder:text-white placeholder:opacity-80 font-medium text-white"
          placeholder="Search people"
        />
      </div>
      <div className="mx-4 my-4 p-4 bg-[#0AA2B3] rounded-xl">
        <h1 className="font-bold text-lg text-white mb-3">Suggestions</h1>
        
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center min-w-0 flex-1">
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="48"
                  round={true}
                  className="flex-shrink-0"
                />
                <div className="ml-3 min-w-0 mr-3">
                  <h1 
                    className="font-bold text-white text-base whitespace-nowrap overflow-hidden text-ellipsis"
                    title={user?.name}
                  >
                    {user?.name}
                  </h1>
                  <p 
                    className="text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis opacity-90"
                    title={formatUsername(user?.username)}
                  >
                    {formatUsername(user?.username)}
                  </p>
                </div>
              </div>
              <Link 
                to={`/profile/${user?._id}`}
                className="flex-shrink-0"
              >
                <button className="px-4 py-1.5 bg-[#048193] hover:bg-[#3A9DA8] rounded-full text-white text-sm font-medium">
                  Profile
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white text-center py-3 opacity-90">No users found</p>
        )}
      </div>
    </div>
  );
};

export default RightBar;