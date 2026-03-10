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

        // Add auth token if available
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 - Unauthorized
                if (response.status === 401) {
                    this.removeToken();
                    window.location.href = '/admin/login';
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
};

// Certificate API
export const certificateApi = {
    generate: (data) => apiService.post(API_ENDPOINTS.CERTIFICATE_GENERATE, data),
    download: (id) => `${apiService.baseURL}${API_ENDPOINTS.CERTIFICATE_DOWNLOAD(id)}`,
    verify: (certNumber) => apiService.get(API_ENDPOINTS.CERTIFICATE_VERIFY(certNumber)),
};

// Payment API
export const paymentApi = {
    getAll: (params) => apiService.get(API_ENDPOINTS.PAYMENTS, params),
    create: (data) => apiService.post(API_ENDPOINTS.PAYMENTS, data),
};

// Template API
export const templateApi = {
    getAll: () => apiService.get(API_ENDPOINTS.TEMPLATES),
    upload: (data) => apiService.post(API_ENDPOINTS.TEMPLATES, data),
};

export default apiService;

