'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/auth-reducer';
const store = configureStore({
  reducer: {
    user: authReducer,
  },
});
export default store;

