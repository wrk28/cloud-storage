import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials) => {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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