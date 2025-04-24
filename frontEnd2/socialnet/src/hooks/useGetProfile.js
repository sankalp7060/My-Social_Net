import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getMyProfile } from "../redux/userSlice";
import toast from "react-hot-toast";

const useGetProfile = (id) => {
  const dispatch = useDispatch();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
        withCredentials: true
      });
      dispatch(getMyProfile(res.data.user));
      return res.data.user; 
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
      throw error;
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    refreshProfile: fetchProfile 
  };
};

export default useGetProfile;