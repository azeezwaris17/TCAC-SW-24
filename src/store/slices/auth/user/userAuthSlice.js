// store/slices/auth/user/userAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Define async thunks
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/register', formValues);
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/login', formValues);
      localStorage.setItem('userToken', response.data.token); // Save token in localStorage
      return { user: response.data.user, token: response.data.token };
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Login failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  'user/verifyUserEmail',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/verify-email', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Email verification failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'user/resetUserPassword',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/reset-password', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userToken'); // Clear token on logout
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.userAuth) {
          state.user = action.payload.userAuth.user;
          state.token = action.payload.userAuth.token;
        }
      })
      // Register Reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload.user; // Adjust based on API response
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify User Email Reducers
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifyUserEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Password Reset Reducers
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Actions
export const { logoutUser, setUser, clearStatus } = userAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.userAuth.loading;
export const selectAuthStatus = (state) => state.userAuth.status;
export const selectAuthError = (state) => state.userAuth.error;
export const selectUser = (state) => state.userAuth.user;
export const selectUserToken = (state) => state.userAuth.token;
export const selectIsUserAuthenticated = (state) => !!state.userAuth.token;

export default userAuthSlice.reducer;
