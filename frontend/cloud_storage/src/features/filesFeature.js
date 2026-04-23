import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async () => {
  const response = await fetch('http://127.0.0.1:8000/api/files/?user_id=1');
  const data = await response.json();
  return data.data;
});

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ id }) => {
    await fetch(`http://127.0.0.1:8000/api/files/?file_id=${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

const filesFeature = createSlice({
  name: 'files',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchFiles.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.list = state.list.filter((file) => file.id !== action.payload);
      });
  },
});

export default filesFeature.reducer;