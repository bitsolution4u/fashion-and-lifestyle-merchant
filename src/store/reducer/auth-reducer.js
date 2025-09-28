'use client';
import { createSlice } from '@reduxjs/toolkit';

const userReducer = createSlice({
  name: 'user',
  initialState: {
    isVerified: false,
    isLoggedIn: false,
    loginUserInfo: null,
  },
  reducers: {
    handleUserReducer: (state = initialState, { payload }) => {
      if (payload.type == 'LOGIN') {
        return {
          ...state,
          isVerified: true,
          isLoggedIn: false,
          loginUserInfo: null,
        };
      }
       else if (payload.type == 'SAVE_LOGIN_USER_INFO') {
        return {
          ...state,
          loginUserInfo: payload.data,
        };
      }
      else {
        return {
          ...state,
        };
      }
    },
  },
});

export const { handleUserReducer } = userReducer.actions;

export default userReducer.reducer;
