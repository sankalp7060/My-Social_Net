import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../redux/postSlice";

const useGetPost = (id) => {
  const dispatch = useDispatch();
  const { refresh, isActive } = useSelector((store) => store.post);

  axios.defaults.withCredentials = true;
  const fetchMyPost = async () => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/allPost/${id}`);
      dispatch(getAllPost(res.data.post));
    } catch (error) {
      console.error(error);
    }
  };

  const followingHandler = async () => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/followingPost/${id}`);
      dispatch(getAllPost(res.data.post));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      isActive ? fetchMyPost() : followingHandler();
    }
    return () => {
      dispatch(getAllPost([]));
    };
  }, [id, isActive, refresh, dispatch]);
};

export default useGetPost;
