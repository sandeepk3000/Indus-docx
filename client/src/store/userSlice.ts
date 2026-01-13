import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface UserState {
  user: any;
  status: boolean;
  token: string | null;
}
const initialState: UserState = {
  user: null,
  token: null,
  status: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: UserState["user"];
        token: UserState["token"];
        status: UserState["status"];
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = false;
    },
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
