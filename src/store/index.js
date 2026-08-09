import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import userAuthReducer from "./slices/auth/user/userAuthSlice";
import adminAuthReducer from "./slices/auth/admin/adminAuthSlice";
import superAdminAuthReducer from "./slices/auth/superAdmin/superAdminAuthSlice";
import userActionsReducer from "./slices/userActionsSlice";
import adminActionsReducer from "./slices/adminActionsSlice";

const makeStore = () => {
  return configureStore({
    reducer: {
      userAuth: userAuthReducer,
      adminAuth: adminAuthReducer,
      superAdminAuth: superAdminAuthReducer,
      userActions: userActionsReducer,
      adminActions: adminActionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  });
};

// Create a wrapper with the latest implementation
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV === 'development',
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state),
});