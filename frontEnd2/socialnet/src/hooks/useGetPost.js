import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../redux/postSlice";

const useGetPost = (id) => {
  const dispatch = useDispatch();
  const { refresh, isActive } = useSelector((store) => store.post);
  const fetchMyPost = async () => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/allPost/${id}`, {
        withCredentials: true,
      });
      dispatch(getAllPost(res.data.posts));
    } catch (error) {
      console.error(error);
    }
  };

  const followingHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${POST_API_END_POINT}/followingPost/${id}`);
      dispatch(getAllPost(res.data.posts));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchMyPost();
    }
    return () => {
      followingHandler();
    };
  }, [isActive, refresh]);
};
export default useGetPost;
