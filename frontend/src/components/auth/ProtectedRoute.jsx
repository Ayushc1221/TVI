import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('admin_token');

    if (!token) {
        // Redirect to login with return url
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
