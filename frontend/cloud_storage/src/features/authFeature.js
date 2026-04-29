import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../config';


const getCsrfToken = async () => {
  const response = await fetch(`${config.URL}/api/auth/login/csrf/`, {
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials) => {
    const token_data = await getCsrfToken();
    const csrfToken = token_data.csrftoken;
    const response = await fetch(`${config.URL}/api/auth/login/`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
  }
);

const authFeature = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isAdmin: false,
    userID: null,
    csrfToken: null,
    sessionID: null
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const responseData = action.payload;
        if (responseData.status === "success") {
            state.isLoggedIn = true;
            state.isAdmin = responseData.auth.is_admin === true;
            state.userID = responseData.auth.user_id;
            state.csrfToken = responseData.auth.csrf_token;
        }
        else {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.userID = null;
        }    
      });
  },
});

export const { logout } = authFeature.actions;
export default authFeature.reducer;