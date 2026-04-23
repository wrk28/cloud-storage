import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersFeature';
import filesReducer from '../features/filesFeature'


export const store = configureStore({
  reducer: {
    users: usersReducer,
    files: filesReducer
  },
});
