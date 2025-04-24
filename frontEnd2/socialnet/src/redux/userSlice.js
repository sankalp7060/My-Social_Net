import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    otherUsers: null,
    profile: {
      avatar: "",
      banner: "",
      name: "",
      bio: "",
      // any other profile fields you have
    },
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfileInfo: (state, action) => {
      const { name, bio, avatar, banner } = action.payload;
      if (state.profile) {
        if (name) state.profile.name = name;
        if (bio) state.profile.bio = bio;
        if (avatar) state.profile.avatar = avatar;
        if (banner) state.profile.banner = banner;
      }
      if (state.user) {
        if (name) state.user.name = name;
        if (bio) state.user.bio = bio;
        if (avatar) state.user.avatar = avatar;
        if (banner) state.user.banner = banner;
      }
    },
    followingUpdate: (state, action) => {
      const userId = action.payload;
      const index = state.user.following.indexOf(userId);
      if (index !== -1) {
        state.user.following.splice(index, 1);
      } else {
        state.user.following.push(userId);
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
} = userSlice.actions;

export default userSlice.reducer;
