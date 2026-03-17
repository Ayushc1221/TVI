import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

/**
 * API Service
 * Handles all API requests with authentication
 */
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Get auth token from localStorage
     */
    getToken() {
        return localStorage.getItem('admin_token');
    }

    /**
     * Set auth token
     */
    setToken(token) {
        localStorage.setItem('admin_token', token);
    }

    /**
     * Remove auth token
     */
    removeToken() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const headers = {
            ...options.headers,
        };

        // If body is NOT FormData, set application/json
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // Only add default admin token if an Authorization header wasn't explicitly provided
        if (!headers['Authorization']) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 - Unauthorized
                // Only redirect if it's NOT a login attempt
                if (response.status === 401 && !endpoint.includes('/login')) {
                    // Check which role to redirect based on current URL
                    if (window.location.pathname.startsWith('/client')) {
                        localStorage.removeItem('client_token');
                        localStorage.removeItem('client_user');
                        window.location.href = '/client/login';
                    } else if (window.location.pathname.startsWith('/auditor')) {
                        localStorage.removeItem('auditor_token');
                        localStorage.removeItem('auditor_user');
                        window.location.href = '/auditor/login';
                    } else if (window.location.pathname.startsWith('/admin')) {
                        this.removeToken();
                        window.location.href = '/admin/login';
                    }
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * POST FormData request
     */
    postFormData(endpoint, formData) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
        });
    }

    /**
     * PATCH request
     */
    patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * PUT request
     */
    put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

// Create singleton instance
const apiService = new ApiService();

// Auth API
export const authApi = {
    login: (credentials) => apiService.post(API_ENDPOINTS.LOGIN, credentials),
    logout: () => apiService.post(API_ENDPOINTS.LOGOUT),
    getMe: () => apiService.get(API_ENDPOINTS.ME),
    changePassword: (data) => apiService.post(API_ENDPOINTS.CHANGE_PASSWORD, data),
};

// Contact API
export const contactApi = {
    submit: (data) => apiService.post(API_ENDPOINTS.CONTACT_SUBMIT, data),
    getAll: (params) => apiService.get(API_ENDPOINTS.CONTACTS, params),
    getById: (id) => apiService.get(API_ENDPOINTS.CONTACT_BY_ID(id)),
    updateStatus: (id, data) => apiService.patch(API_ENDPOINTS.CONTACT_STATUS(id), data),
    delete: (id) => apiService.delete(API_ENDPOINTS.CONTACT_BY_ID(id)),
};

// Dashboard API
export const dashboardApi = {
    getStats: () => apiService.get(API_ENDPOINTS.DASHBOARD_STATS),
    getAnalytics: (params) => apiService.get(API_ENDPOINTS.DASHBOARD_ANALYTICS, params),
};

// Application API
export const applicationApi = {
    getAll: (params) => apiService.get(API_ENDPOINTS.APPLICATIONS, params),
    getById: (id) => apiService.get(API_ENDPOINTS.APPLICATION_BY_ID(id)),
    submit: (formData) => apiService.postFormData(API_ENDPOINTS.APPLICATIONS, formData),
    assignAuditor: (data) => apiService.put(API_ENDPOINTS.APPLICATION_ASSIGN_AUDITOR, data),
    updateStatus: (data) => apiService.put(API_ENDPOINTS.APPLICATION_STATUS, data),
    uploadMOU: (id, formData) => apiService.postFormData(API_ENDPOINTS.APPLICATION_UPLOAD_MOU(id), formData),
    techReview: (id, data) => apiService.post(API_ENDPOINTS.APPLICATION_TECH_REVIEW(id), data),
    verifyDocument: (id, docId) => apiService.put(`/applications/${id}/documents/${docId}/verify`),
};

// Certificate API
export const certificateApi = {
    generate: (data) => data instanceof FormData 
        ? apiService.postFormData(API_ENDPOINTS.CERTIFICATE_GENERATE, data)
        : apiService.post(API_ENDPOINTS.CERTIFICATE_GENERATE, data),
    download: (id) => `${apiService.baseURL}${API_ENDPOINTS.CERTIFICATE_DOWNLOAD(id)}`,
    verify: (certNumber) => apiService.get(API_ENDPOINTS.CERTIFICATE_VERIFY(certNumber)),
};

// Payment API
export const paymentApi = {
    getAll: (params) => apiService.get(API_ENDPOINTS.PAYMENTS, params),
    create: (data) => apiService.post(API_ENDPOINTS.PAYMENTS, data),
    createOrder: (data) => apiService.post(`${API_ENDPOINTS.PAYMENTS}/create-order`, data),
    verify: (data) => apiService.post(`${API_ENDPOINTS.PAYMENTS}/verify`, data),
};

// Template API
export const templateApi = {
    getAll: () => apiService.get(API_ENDPOINTS.TEMPLATES),
    upload: (data) => data instanceof FormData
        ? apiService.postFormData(API_ENDPOINTS.TEMPLATES, data)
        : apiService.post(API_ENDPOINTS.TEMPLATES, data),
};

// Settings API
export const settingsApi = {
    get: () => apiService.get(API_ENDPOINTS.SETTINGS),
    update: (data) => apiService.put(API_ENDPOINTS.SETTINGS, data),
};

// Client API
export const clientApi = {
    login: (credentials) => apiService.post(API_ENDPOINTS.CLIENT_LOGIN, credentials),
    getApplications: () => {
        const token = localStorage.getItem('client_token');
        return apiService.request(API_ENDPOINTS.CLIENT_APPLICATIONS, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    acceptMOU: (id) => {
        const token = localStorage.getItem('client_token');
        return apiService.request(API_ENDPOINTS.CLIENT_ACCEPT_MOU(id), {
            method: 'POST',
            body: JSON.stringify({}),
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
    }
};

// Auditor API
export const auditorApi = {
    getAssignments: () => {
        const token = localStorage.getItem('auditor_token');
        return apiService.request(API_ENDPOINTS.AUDITOR_ASSIGNMENTS, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    submitReport: (id, formData) => {
        const token = localStorage.getItem('auditor_token');
        return apiService.request(API_ENDPOINTS.AUDITOR_SUBMIT_REPORT(id), {
            method: 'POST',
            body: formData,
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default apiService;
