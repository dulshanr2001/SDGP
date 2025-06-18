import axios from 'axios';
import { useLoaderStore } from '../store/use-loader-store';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - set authorization header and show loader
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Show loader
    useLoaderStore.getState().setLoading(true);
    
    return config;
  },
  (error) => {
    // Hide loader on request error
    useLoaderStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor - hide loader and handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Hide loader on successful response
    useLoaderStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    // Hide loader on response error
    useLoaderStore.getState().setLoading(false);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Handle unauthorized access (logout user, redirect to login, etc)
        // localStorage.removeItem('token');
        // You might want to redirect to login page here
      }
    }
    
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
    get: async (url, params) => await apiClient.get(url, { params }),
    post: async (url, data) => await apiClient.post(url, data),
    put: async (url, data) => await apiClient.put(url, data),
    delete: async (url) => await apiClient.delete(url),
    // New method for multipart file uploads
    postMultipart: async (url, formData) => {
        return await apiClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default apiService;