import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      ((state.status = true), (state.user = action.payload));
    },
    logout: (state) => {
      ((state.status = false), (state.user = null));
    },
    update: (state, action) => {
      state.user = action.payload;
    },
  },
});

// export reducers to use it in component files
export const { login, logout, update } = authSlice.actions;

// export for providing reducers to redux store
export default authSlice.reducer;
