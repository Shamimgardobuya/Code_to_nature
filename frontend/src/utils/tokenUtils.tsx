// utils/tokenUtils.ts
import ApiService from "../services/api";

export const setupTokenInterceptor = () => {
  // Add request interceptor to include auth token in requests
  ApiService.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token refresh or auth errors
  ApiService.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token is invalid, clear it
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem("authToken");
};
