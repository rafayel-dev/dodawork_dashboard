import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetSuperAdminProfileQuery } from '../RTK/services/profileApis/superAdminProfileApis';

const ADMIN_RESTRICTED_PATHS = ['/make-admin', '/subscription-management'];

const AuthChecker = ({ children }) => {
    const location = useLocation();
    const { data: superAdmin, isLoading: isProfileLoading } = useGetSuperAdminProfileQuery();
    const [toastShown, setToastShown] = useState(false);

    const role = superAdmin?.data?.authId?.role || null;

    if (isProfileLoading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <span className="loader-black"></span>
            </div>
        );
    }

    if (!role) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role === 'SUPER_ADMIN') return children;

    if (role === 'ADMIN') {
        if (ADMIN_RESTRICTED_PATHS.includes(location.pathname)) {
            if (!toastShown) {
                toast.error("You don't have access to this page");
                setToastShown(true);
            }
            return <Navigate to="/" replace />;
        }
        return children;
    }

    if (!toastShown) {
        toast.error("You don't have access to this page");
        setToastShown(true);
    }
    return <Navigate to="/" replace />;
};

export default AuthChecker;
