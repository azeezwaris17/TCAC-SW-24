// store/slices/auth/admin/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Define async thunks
export const registerAdmin = createAsyncThunk(
  'admin/registerAdmin',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/register', formValues);
      return response.data; 
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/login', formValues);

      localStorage.setItem('adminToken', response.data.token); 

      return { admin: response.data.adminData, token: response.data.token };
      
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Login failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifyAdminEmail = createAsyncThunk(
  'admin/verifyAdminEmail',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/verify-email', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Email verification failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const resetAdminPassword = createAsyncThunk(
  'admin/resetAdminPassword',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/reset-password', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const sendResetCode = createAsyncThunk(
  'admin/sendResetCode',
  async ({ email }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/send-reset-code', { email });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to send reset code';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifyResetCodeAndChangePassword = createAsyncThunk(
  'admin/verifyResetCodeAndChangePassword',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/verify-reset-code', { email, code, password });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminData');
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.token = localStorage.getItem('adminToken');
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.adminAuth) {
          state.admin = action.payload.adminAuth.admin;
          state.token = action.payload.adminAuth.token;
        }
      })
      // Register Reducers
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.admin = action.payload
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login Reducers
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify Admin Email Reducers
      .addCase(verifyAdminEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifyAdminEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyAdminEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Password Reset Reducers
      .addCase(resetAdminPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetAdminPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Send Reset Code Reducers
      .addCase(sendResetCode.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(sendResetCode.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify Reset Code and Change Password Reducers
      .addCase(verifyResetCodeAndChangePassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifyResetCodeAndChangePassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyResetCodeAndChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Actions
export const { logoutAdmin, setAdmin, clearStatus } = adminAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.adminAuth.loading;
export const selectAuthStatus = (state) => state.adminAuth.status;
export const selectAuthError = (state) => state.adminAuth.error;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectAdminToken = (state) => state.adminAuth.token;
export const selectIsAdminAuthenticated = (state) => !!state.adminAuth.token;

export default adminAuthSlice.reducer;
