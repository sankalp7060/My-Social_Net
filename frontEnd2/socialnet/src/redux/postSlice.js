import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    post: null,
    refresh: false,
    isActive: true,
  },
  reducers: {
    getAllPost: (state, action) => {
      state.post = action.payload;
    },
    getRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    getIsActive: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { getAllPost, getRefresh, getIsActive } = postSlice.actions;
export default postSlice.reducer;
