import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

export const registerSuperAdmin = createAsyncThunk(
  'superAdmin/registerSuperAdmin',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/register', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Registration failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const loginSuperAdmin = createAsyncThunk(
  'superAdmin/login',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/login', formValues);
      localStorage.setItem('superAdminToken', response.data.token);
      return { superAdmin: response.data.superAdminData, token: response.data.token };
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Login failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifySuperAdminEmail = createAsyncThunk(
  'superAdmin/verifySuperAdminEmail',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/verify-email', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Email verification failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const resetSuperAdminPassword = createAsyncThunk(
  'superAdmin/resetSuperAdminPassword',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/reset-password', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Password reset failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const sendResetCode = createAsyncThunk(
  'superAdmin/sendResetCode',
  async ({ email }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/send-reset-code', { email });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to send reset code';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifyResetCodeAndChangePassword = createAsyncThunk(
  'superAdmin/verifyResetCodeAndChangePassword',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/verify-reset-code', { email, code, password });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState: {
    superAdmin: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutSuperAdmin: (state) => {
      state.superAdmin = null;
      state.token = null;
      localStorage.removeItem('superAdminToken');
      sessionStorage.removeItem('superAdminData');
    },
    setSuperAdmin: (state, action) => {
      state.superAdmin = action.payload;
      state.token = localStorage.getItem('superAdminToken');
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.superAdminAuth) {
          state.superAdmin = action.payload.superAdminAuth.superAdmin;
          state.token = action.payload.superAdminAuth.token;
        }
      })
      .addCase(registerSuperAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.superAdmin = action.payload;
      })
      .addCase(registerSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.superAdmin = action.payload.superAdmin;
        state.token = action.payload.token;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifySuperAdminEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifySuperAdminEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifySuperAdminEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetSuperAdminPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetSuperAdminPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetSuperAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
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

export const { logoutSuperAdmin, setSuperAdmin, clearStatus } = superAdminAuthSlice.actions;

export const selectAuthLoading = (state) => state.superAdminAuth.loading;
export const selectAuthStatus = (state) => state.superAdminAuth.status;
export const selectAuthError = (state) => state.superAdminAuth.error;
export const selectSuperAdmin = (state) => state.superAdminAuth.superAdmin;
export const selectSuperAdminToken = (state) => state.superAdminAuth.token;
export const selectIsSuperAdminAuthenticated = (state) => !!state.superAdminAuth.token;

export default superAdminAuthSlice.reducer; 