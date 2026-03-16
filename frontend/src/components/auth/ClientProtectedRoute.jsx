import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Client Protected Route Component
 * Redirects to client login if not authenticated as client
 */
const ClientProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('client_token'); 
    const user = JSON.parse(localStorage.getItem('client_user') || '{}');

    if (!token || user.role !== 'client') {
        // Redirect to login with return url
        return <Navigate to="/client/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ClientProtectedRoute;
