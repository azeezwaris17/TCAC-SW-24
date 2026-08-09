import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

export const sendResetCode = createAsyncThunk(
  'user/sendResetCode',
  async ({ email }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/send-reset-code', { email });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to send reset code';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const verifyResetCodeAndChangePassword = createAsyncThunk(
  'user/verifyResetCodeAndChangePassword',
  async ({ email, code, password }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/verify-reset-code', { email, code, password });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/register', formValues);
      return response.data;
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
      sessionStorage.setItem('userData', JSON.stringify({
        user: response.data.user,
        token: response.data.token
      }));
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
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  status: 'idle',
  error: null,
};

// Try to get initial state from sessionStorage
if (typeof window !== 'undefined') {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    const { user, token } = JSON.parse(userData);
    initialState.user = user;
    initialState.token = token;
  }
}

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem('userData');
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
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

export const { logoutUser, setUser, clearStatus } = userAuthSlice.actions;
export const selectAuthLoading = (state) => state.userAuth.loading;
export const selectAuthStatus = (state) => state.userAuth.status;
export const selectAuthError = (state) => state.userAuth.error;
export const selectUser = (state) => state.userAuth.user;
export const selectUserToken = (state) => state.userAuth.token;
export const selectIsUserAuthenticated = (state) => !!state.userAuth.token;
export default userAuthSlice.reducer;