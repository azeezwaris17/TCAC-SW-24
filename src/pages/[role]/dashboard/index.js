import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import DashboardLayout from "../../../layouts/dashboard/DashboardLayout";
import withAuth from "../../../components/auth/withAuth";
import {
  selectIsUserAuthenticated,
  selectUserToken,
  selectUser,
  logoutUser,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  selectIsAdminAuthenticated,
  selectAdminToken,
  selectAdmin,
  logoutAdmin,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  selectIsSuperAdminAuthenticated,
  selectSuperAdminToken,
  selectSuperAdmin,
  logoutSuperAdmin,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";

const DashboardPage = () => {
  const router = useRouter();
  const { role } = router.query;
  const toast = useToast();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  // Memoized selector map for role-based authentication
  const selectors = useMemo(() => ({
    user: {
      isAuthenticated: selectIsUserAuthenticated,
      token: selectUserToken,
      accountInfo: selectUser,
      logout: logoutUser,
    },
    admin: {
      isAuthenticated: selectIsAdminAuthenticated,
      token: selectAdminToken,
      accountInfo: selectAdmin,
      logout: logoutAdmin,
    },
    "super-admin": {
      isAuthenticated: selectIsSuperAdminAuthenticated,
      token: selectSuperAdminToken,
      accountInfo: selectSuperAdmin,
      logout: logoutSuperAdmin,
    },
  }), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default to 'user' if the role is undefined or invalid
  const currentRole = selectors[role] ? role : "user";

  // Extract necessary selectors
  const { isAuthenticated, token, accountInfo, logout } = selectors[currentRole];

  // Select the current authentication and account data
  const isAuth = useSelector(isAuthenticated);
  const authToken = useSelector(token);
  const accountData = useSelector(accountInfo);

  useEffect(() => {
    if (isClient && accountData && accountData.role) {
      console.log("User role:", accountData.role);
    }
  }, [accountData, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <DashboardLayout
      role={accountData?.role}
      adminFunction={currentRole === 'admin' ? accountData?.adminFunction : undefined}
      accountData={accountData}
      logout={() => {
        console.log("Logging out");
        dispatch(logout());
        sessionStorage.removeItem('userData');
        router.push(`/login/${currentRole}`);
      }}
    />
  );
};

export default withAuth(DashboardPage);
