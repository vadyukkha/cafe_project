import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    return {
      isAuthenticated: !!token,
      accessToken: token,
    };
  }
  return {
    isAuthenticated: false,
    accessToken: null,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.isAuthenticated = true;
      state.accessToken = accessToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', accessToken);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    },
    setInitialAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
});

export const { setCredentials, logout, setInitialAuth } = authSlice.actions;
export default authSlice.reducer;
