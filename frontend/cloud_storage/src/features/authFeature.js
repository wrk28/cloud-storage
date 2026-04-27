import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const getCookies = (name) => {
//   const value = `; ${document.cookie}`;
//   console.log("value is", value)
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }


const getCsrfToken = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/login/csrf/', {
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
    console.log("token is ", csrfToken)
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
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