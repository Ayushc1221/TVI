/**
 * API Configuration
 * 
 * This file contains API URLs for different environments.
 * The correct URL is automatically selected based on environment.
 */

// Determine if we're in production
const isProduction = import.meta.env.PROD;

// API Base URLs
const API_URLS = {
    development: 'http://localhost:5000/api',
    production: import.meta.env.VITE_API_URL || 'https://your-railway-app.up.railway.app/api',
};

// Export the appropriate API URL
export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',

    // Contact
    CONTACT_SUBMIT: '/contact',
    CONTACTS: '/contact',
    CONTACT_BY_ID: (id) => `/contact/${id}`,
    CONTACT_STATUS: (id) => `/contact/${id}/status`,

    // Dashboard
    DASHBOARD_STATS: '/dashboard/stats',
    DASHBOARD_ANALYTICS: '/dashboard/analytics',

    // Applications
    APPLICATIONS: '/applications',
    APPLICATION_BY_ID: (id) => `/applications/${id}`,
    APPLICATION_ASSIGN_AUDITOR: '/applications/assign-auditor',
    APPLICATION_STATUS: '/applications/status',

    // Certificates
    CERTIFICATE_GENERATE: '/certificates/generate',
    CERTIFICATE_DOWNLOAD: (id) => `/certificates/download/${id}`,
    TEMPLATES: '/templates',
    CERTIFICATE_VERIFY: (certNumber) => `/certificates/verify/${certNumber}`,

    // Payments
    PAYMENTS: '/payments',

    // Health
    HEALTH: '/health',

    // Settings
    SETTINGS: '/settings',

    // Client
    CLIENT_LOGIN: '/client/login',
    CLIENT_APPLICATIONS: '/client/applications',
};

export default {
    API_BASE_URL,
    API_ENDPOINTS,
};
