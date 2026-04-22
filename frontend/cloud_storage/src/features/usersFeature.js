import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('http://127.0.0.1:8000/api/users/');
  const data = await response.json();
  return data.data;
});

export const updateUserAdminStatus = createAsyncThunk(
  'users/updateAdminStatus',
  async ({ id, is_staff }) => {
    await fetch(`http://127.0.0.1:8000/api/users/?user_id=${id}`, {
      method: 'PATCH',
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
    const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  }
);


export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials) => {
    const response = await fetch('http://127.0.0.1:8000/login/', {
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

const usersFeature = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    showDeleteModal: false,
  },
  reducers: {
    toggleShowDeleteModal(state, action) {
      state.showDeleteModal = action.payload;
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
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { toggleShowDeleteModal } = usersFeature.actions;

export default usersFeature.reducer;

