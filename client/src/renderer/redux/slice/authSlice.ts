import { createSlice } from '@reduxjs/toolkit';

interface Account {
  username: string;
  avatar: string;
  _id: string;
  email: string;
}
interface AuthSlice {
  isLoggedIn: boolean;
  loading: boolean;
  user: Account | null;
}
const initialState: AuthSlice = {
  isLoggedIn: false,
  loading: false,
  user: null,
};

const authSlice = createSlice({
  initialState,
  name: 'authSlice',
  reducers: {
    login: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      const user = action?.payload?.user;
      state.loading = false;
      state.isLoggedIn = true;
      state.user = user;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
    },
    getMe: (state, action) => {
      const user = action?.payload?.user;
      state.loading = false;
      state.isLoggedIn = true;
      state.user = user;
    },
  },
});

export const { getMe, login, loginFailure, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
