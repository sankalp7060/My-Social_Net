import React from "react";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { useSelector } from "react-redux";

const Feed = () => {
  const { post } = useSelector((store) => store.post);
  return (
    <div className="w-[50%] border border-gray-200">
      <div>
        <CreatePost />
        {post?.map((post) => (
          <Post key={post?._id} post={post}/>
        ))}
      </div>
    </div>
  );
};

export default Feed;
