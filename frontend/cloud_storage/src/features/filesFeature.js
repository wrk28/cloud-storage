import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async () => {
  const response = await fetch('http://127.0.0.1:8000/api/files/?user_id=32');
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

export const downloadFile = createAsyncThunk(
  'files/downloadFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/download/?file_id=${fileId}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      return { fileId, blob };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFileDescription = createAsyncThunk(
  'files/updateFileDescription',
  async ({ id, description }, { rejectWithValue }) => {
    const response = await fetch(`http://127.0.0.1:8000/api/files/?file_id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      return rejectWithValue('Failed to update description');
    }
    const data = await response.json();
    return { id, description: data.description || description };
  }
);

const filesSlice = createSlice({
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
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        const { blob, fileId } = action.payload;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const file = state.list.find((f) => f.id === fileId);
        a.download = file?.name || 'download';
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .addCase(updateFileDescription.fulfilled, (state, action) => {
        const { id, description } = action.payload;
        const file = state.list.find((f) => f.id === id);
        if (file) {
          file.description = description;
        }
      });
  },
});

export default filesSlice.reducer;