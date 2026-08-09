import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from '../../store/slices/auth/admin/adminAuthSlice';
import { setSuperAdmin } from '../../store/slices/auth/superAdmin/superAdminAuthSlice';

const withAuth = (WrappedComponent) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isClient, setIsClient] = useState(false);
    
    // Get authentication state for all user types
    const userAuth = useSelector((state) => state.userAuth);
    const adminAuth = useSelector((state) => state.adminAuth);
    const superAdminAuth = useSelector((state) => state.superAdminAuth);

    useEffect(() => {
      setIsClient(true);
      
      // Check if we're on the client side
      if (typeof window !== 'undefined') {
        // Check for stored authentication data
        const adminData = sessionStorage.getItem('adminData');
        const superAdminData = sessionStorage.getItem('superAdminData');
        const adminToken = localStorage.getItem('adminToken');
        const superAdminToken = localStorage.getItem('superAdminToken');
        
        // Restore authentication state if found in sessionStorage or localStorage
        if (adminData && adminToken) {
          dispatch(setAdmin(JSON.parse(adminData)));
        }
        if (superAdminData && superAdminToken) {
          dispatch(setSuperAdmin(JSON.parse(superAdminData)));
        }
        
        // Check if any user type is authenticated
        const isAuthenticated = userAuth.token || adminToken || superAdminToken;
        
        if (!isAuthenticated) {
          // Redirect to appropriate login page based on the current route
          const path = router.pathname;
          if (path.includes('admin')) {
            router.replace('/login/admin');
          } else if (path.includes('super-admin')) {
            router.replace('/login/super-admin');
          } else {
            router.replace('/login/user');
          }
        }
      }
    }, [userAuth.token, adminAuth.token, superAdminAuth.token, router, dispatch]);

    // During SSR or initial client render, return null
    if (!isClient) {
      return null;
    }

    // If not authenticated, don't render the component
    if (!userAuth.token && !adminAuth.token && !superAdminAuth.token) {
      return null;
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 