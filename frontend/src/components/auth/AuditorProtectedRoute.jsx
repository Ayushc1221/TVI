import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Auditor Protected Route Component
 * Redirects to auditor login if not authenticated as auditor
 */
const AuditorProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('auditor_token'); // Ensure auditor uses strict auth separate from admin
    const user = JSON.parse(localStorage.getItem('auditor_user') || '{}');

    if (!token || user.role !== 'auditor') {
        // Redirect to login with return url
        return <Navigate to="/auditor/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuditorProtectedRoute;
