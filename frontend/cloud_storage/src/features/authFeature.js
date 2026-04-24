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
    // userData: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoggedIn = true;
      });
  },
});

export const { logout } = authFeature.actions;
export default authFeature.reducer;