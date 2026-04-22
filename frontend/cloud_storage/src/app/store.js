import { configureStore } from '@reduxjs/toolkit';
import usersReducer, { registerUser } from '../features/usersFeature';


export const store = configureStore({
  reducer: {
    users: usersReducer,
    files: {}
  },
});
