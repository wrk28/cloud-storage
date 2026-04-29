import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getCsrfToken from '../services/getCsrfToken';
import config from '../../config';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async ({ id }) => {
  const response = await fetch(`${config.URL}/api/files/?user_id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });
  const data = await response.json();
  return data.data;
});

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ id }) => {
    const csrfToken = getCsrfToken();
    await fetch(`${config.URL}/api/files/?file_id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });
    return id;
  }
);

export const downloadFile = createAsyncThunk(
  'files/downloadFile',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.URL}/api/download/?file_id=${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Download error');
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = '';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        fileName = contentDisposition.split('filename=')[1].replace(/["']/g, '');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { id, blob, fileName };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFileDescription = createAsyncThunk(
  'files/updateFileDescription',
  async ({ id, description }, { rejectWithValue }) => {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${config.URL}/api/files/?file_id=${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      return rejectWithValue('Update');
    }
    const data = await response.json();
    return { id, description: data.description || description };
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ file, description }, { getState, rejectWithValue }, ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('file_name', file.name);

    const state = getState();
    const userID= state.auth.userID;
    formData.append('user_id', userID);
    const csrfToken = state.auth.csrfToken;
    formData.append('csrfmiddlewaretoken', csrfToken);

    try {
      const response = await fetch(`${config.URL}/api/upload/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error('Upload error');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const filesFeature = createSlice({
  name: 'files',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
    }
  },
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
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { resetStatus } = filesFeature.actions;
export default filesFeature.reducer;