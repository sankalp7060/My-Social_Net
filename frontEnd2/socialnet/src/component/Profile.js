import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { IoArrowBackOutline, IoPencilOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetProfile from "../hooks/useGetProfile";
import { USER_API_END_POINT } from "../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/postSlice";
import { followingUpdate, updateProfileInfo } from "../redux/userSlice";

const Profile = () => {
  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [banner, setBanner] = useState(profile?.banner || "");

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const { refreshProfile } = useGetProfile(id);
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setAvatar(profile.avatar || "");
      setBanner(profile.banner || "");
    }
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsFollowLoading(true);

      const res = await axios.put(
        `${USER_API_END_POINT}/update/${id}`,
        {
          name: name.trim(),
          bio: bio.trim(),
          avatar,
          banner,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      dispatch(getRefresh());
      dispatch(
        updateProfileInfo({
          name: res.data.user.name,
          bio: res.data.user.bio,
          avatar: res.data.user.avatar,
          banner: res.data.user.banner,
        })
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const followOrUnfollowHandler = async () => {
    const isFollowing = user?.following?.includes(id);
    const action = isFollowing ? "unfollow" : "follow";

    try {
      setIsFollowLoading(true);
      dispatch(followingUpdate(id));

      const res = await axios.post(
        `${USER_API_END_POINT}/${action}/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      dispatch(getRefresh());
      refreshProfile();

      toast.success(res.data.message);
    } catch (error) {
      dispatch(followingUpdate(id));
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="w-[50%] border-l border-r border-gray-300">
      <div>
        <div className="flex items-center py-2">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-[#5CC7D8] cursor-pointer"
          >
            <IoArrowBackOutline size="24px" />
          </Link>
          <div className="ml-2">
            <h1 className="font-bold text-lg">{profile?.name}</h1>
            <p className="text-sm text-gray-500">10 posts</p>
          </div>
        </div>

        {isEditing ? (
          <div className="relative">
            <img
              src={
                banner ||
                "https://wallpapers.com/images/hd/technology-linkedin-background-dnic4b0thk1hgfm2.jpg"
              }
              alt="banner"
              className="w-full h-[220px] object-cover object-center"
            />
            <input
              type="file"
              ref={bannerInputRef}
              onChange={handleBannerChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => bannerInputRef.current.click()}
              className="absolute top-2 right-2 bg-[#048193] hover:bg-[#036a7a] text-white p-2 rounded-full"
              aria-label="Edit banner"
            >
              <IoPencilOutline size="20px" />
            </button>
          </div>
        ) : (
          <img
            src={
              profile?.banner ||
              "https://wallpapers.com/images/hd/technology-linkedin-background-dnic4b0thk1hgfm2.jpg"
            }
            alt="banner"
            className="w-full h-[220px] object-cover object-center"
          />
        )}

        <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
          {isEditing ? (
            <div className="relative">
              <Avatar
                src={
                  avatar ||
                  "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                }
                size="120"
                round={true}
                className="object-cover"
              />
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => avatarInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-[#048193] hover:bg-[#036a7a] text-white p-2 rounded-full"
                aria-label="Edit avatar"
              >
                <IoPencilOutline size="20px" />
              </button>
            </div>
          ) : (
            <Avatar
              src={
                profile?.avatar ||
                "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
              }
              size="120"
              round={true}
              className="object-cover"
            />
          )}
        </div>

        <div className="text-right m-4">
          {profile?._id === user?._id ? (
            isEditing ? (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1 bg-gray-300 rounded-full font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isFollowLoading}
                  className={`px-4 py-1 bg-[#048193] rounded-full text-white font-bold ${
                    isFollowLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#036a7a]"
                  }`}
                >
                  {isFollowLoading ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-4 py-1 bg-[#048193] rounded-full text-white font-bold hover:bg-[#036a7a]"
              >
                Edit Profile
              </button>
            )
          ) : (
            <button
              onClick={followOrUnfollowHandler}
              disabled={isFollowLoading}
              className={`px-4 py-1 rounded-full text-white font-bold ${
                isFollowLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : user?.following?.includes(id)
                  ? "bg-[#048193] hover:bg-[#036a7a]"
                  : "bg-[#048193] hover:bg-[#036a7a]"
              }`}
            >
              {isFollowLoading
                ? "Processing..."
                : user?.following?.includes(id)
                ? "Following"
                : "Follow"}
            </button>
          )}
        </div>

        <div className="m-4 mt-12">
          {isEditing ? (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048193]"
                placeholder="Enter your name"
              />

              <label
                className="block text-gray-700 text-sm font-bold mt-4 mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={profile?.username || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>
          ) : (
            <>
              <h1 className="font-bold text-xl">{profile?.name}</h1>
              <p className="text-gray-500">@{profile?.username}</p>
            </>
          )}
        </div>

        <div className="m-4">
          {isEditing ? (
            <>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bio"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048193]"
                placeholder="Tell us about yourself"
                rows="3"
              />
            </>
          ) : (
            <p className="text-sm ml-[10px]">
              {profile?.bio }
            </p>
          )}
        </div>

        <div className="flex justify-around border-t border-gray-300 mt-4 pt-4">
          <div className="text-center">
            <p className="font-bold">{profile?.following?.length || 0}</p>
            <p className="text-gray-500">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{profile?.followers?.length || 0}</p>
            <p className="text-gray-500">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
