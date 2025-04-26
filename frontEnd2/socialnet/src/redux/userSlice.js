import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  otherUsers: null,
  profile: {
    avatar: "",
    banner: "",
    name: "",
    bio: "",
  },
  userMap: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
      if (action.payload?._id) {
        state.userMap[action.payload._id] = action.payload;
      }
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
      if (Array.isArray(action.payload)) {
        action.payload.forEach((user) => {
          if (user?._id) {
            state.userMap[user._id] = user;
          }
        });
      }
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfileInfo: (state, action) => {
      const { name, bio, avatar, banner } = action.payload;

      // Update profile
      if (state.profile) {
        if (name !== undefined) state.profile.name = name;
        if (bio !== undefined) state.profile.bio = bio;
        if (avatar !== undefined) state.profile.avatar = avatar;
        if (banner !== undefined) state.profile.banner = banner;
      }

      // Update user
      if (state.user) {
        if (name !== undefined) state.user.name = name;
        if (bio !== undefined) state.user.bio = bio;
        if (avatar !== undefined) state.user.avatar = avatar;
        if (banner !== undefined) state.user.banner = banner;

        // Update userMap
        if (state.user._id) {
          state.userMap[state.user._id] = {
            ...state.userMap[state.user._id],
            name:
              name !== undefined ? name : state.userMap[state.user._id]?.name,
            bio: bio !== undefined ? bio : state.userMap[state.user._id]?.bio,
            avatar:
              avatar !== undefined
                ? avatar
                : state.userMap[state.user._id]?.avatar,
            banner:
              banner !== undefined
                ? banner
                : state.userMap[state.user._id]?.banner,
          };
        }
      }
    },
    followingUpdate: (state, action) => {
      const userId = action.payload;
      if (state.user && Array.isArray(state.user.following)) {
        const index = state.user.following.indexOf(userId);
        if (index !== -1) {
          state.user.following.splice(index, 1);
        } else {
          state.user.following.push(userId);
        }
      }
    },
    updateUserMap: (state, action) => {
      const user = action.payload;
      if (user && user._id) {
        state.userMap[user._id] = {
          ...state.userMap[user._id],
          ...user,
        };
      }
    },
    updateUserMapBatch: (state, action) => {
      const users = action.payload;
      if (Array.isArray(users)) {
        users.forEach((user) => {
          if (user && user._id) {
            state.userMap[user._id] = {
              ...state.userMap[user._id],
              ...user,
            };
          }
        });
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.otherUsers = null;
      state.profile = {
        avatar: "",
        banner: "",
        name: "",
        bio: "",
      };
      state.userMap = {};
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      const index = state.user.bookmark.indexOf(postId);
      if (index === -1) {
        state.user.bookmark.push(postId);
      } else {
        state.user.bookmark.splice(index, 1);
      }
    },
  },
});

export const {
  getUser,
  getOtherUsers,
  getMyProfile,
  updateProfileInfo,
  followingUpdate,
  updateUserMap,
  updateUserMapBatch,
  logoutUser,
  toggleBookmark,
} = userSlice.actions;

export default userSlice.reducer;
