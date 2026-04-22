import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersFeature';


export const store = configureStore({
  reducer: {
    users: usersReducer,
    files: {},
  },
});
