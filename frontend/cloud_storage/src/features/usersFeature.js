import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../config';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch(`${config.URL}/api/users/`, {
    method: 'GET',
    credentials: 'include'
  });
  const data = await response.json();
  return data.data;
});

export const updateUserAdminStatus = createAsyncThunk(
  'users/updateAdminStatus',
  async ({ id, is_staff }) => {
    await fetch(`${config.URL}/api/users/?user_id=${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, is_staff }),
    });
    return { id, is_staff };
  }
);

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData) => {
    const response = await fetch(`${config.URL}/api/auth/register/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteUserRecord = createAsyncThunk(
  'files/deleteFile',
  async ({ id }) => {
    await fetch(`${config.URL}/api/users/?user_id=${id}`, {
      credentials: 'include',
      method: 'DELETE',
    });
    return id;
  }
);

const usersFeature = createSlice({
  name: 'users',
  initialState: {
    selectedUser: null,
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
     setUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateUserAdminStatus.fulfilled, (state, action) => {
        const { id, is_staff } = action.payload;
        const user = state.list.find((u) => u.id === id);
        if (user) {
          user.is_staff = is_staff;
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUserRecord.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export const {setUser} = usersFeature.actions;
export default usersFeature.reducer;

