import React from "react";
import { useSelector } from "react-redux";
import FeedTabs from "./FeedTabs";
import CreatePostInput from "./CreatePostInput";
import Post from "./Post";

const Feed = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="w-[50%] border border-gray-200">
      <FeedTabs />
      <CreatePostInput />
      <div>
        {posts?.map((post) => (
          <Post key={post?._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;