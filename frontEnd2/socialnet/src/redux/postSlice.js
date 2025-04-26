import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: null,
    refresh: false,
    isActive: true,
  },
  reducers: {
    getAllPost: (state, action) => {
      state.posts = action.payload;
    },
    getRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    getIsActive: (state, action) => {
      state.isActive = action.payload;
    },
    updatePostUserDetails: (state, action) => {
      const { userId, updatedUser } = action.payload;
      if (state.posts) {
        state.posts = state.posts.map((post) => {
          if (post.userId === userId) {
            return {
              ...post,
              userDetails: [updatedUser],
            };
          }
          return post;
        });
      }
    },
  },
});

export const { getAllPost, getRefresh, getIsActive, updatePostUserDetails } =
  postSlice.actions;
export default postSlice.reducer;