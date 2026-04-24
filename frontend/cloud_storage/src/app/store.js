import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersFeature';
import filesReducer from '../features/filesFeature'
import authReducer from '../features/authFeature'


export const store = configureStore({
  reducer: {
    users: usersReducer,
    files: filesReducer,
    auth: authReducer
  },
});
