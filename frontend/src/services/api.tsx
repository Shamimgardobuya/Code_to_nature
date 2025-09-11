// services/api.ts
import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'https://code-to-nature.onrender.com/api';

const ApiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth methods
export const login = async (email: string, password: string) => {
  const response = await ApiService.post('/token/', { email, password });
  const { access } = response.data;
  localStorage.setItem("authToken", access);
  window.location.href = '/login';
};

export const register = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await ApiService.post('/users/', userData);
  // Extract user data directly from response.data (which matches the email/username structure)
  const { email, username } = response.data.data;
  const user = { email, username };
  return { user };
};

export const getProfile = async () => {
  const response = await ApiService.get('/profiles/me/');
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await ApiService.patch('/profiles/me/', profileData);
  return response.data;
};

// Profile image upload function
export const uploadProfileImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('profile_pic', imageFile);

  const response = await ApiService.post('/profiles/me/upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.profile_pic_url; // Assuming the API returns the image URL
};

// Combined profile update with image upload
export const updateProfileWithImage = async (profileData: any, imageFile?: File) => {
  let updatedProfile;
  
  // First update the profile data
  if (Object.keys(profileData).length > 0) {
    updatedProfile = await updateProfile(profileData);
  }
  
  // Then upload image if provided
  if (imageFile) {
    const imageUrl = await uploadProfileImage(imageFile);
    // Update the profile with the new image URL
    updatedProfile = await updateProfile({ profile_pic: imageUrl });
  }
  
  return updatedProfile;
};

// Add a function to set the auth token for requests
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we get a 401, remove the token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// We might also want to export a function to log out
export const logout = () => {
  localStorage.removeItem('authToken');
};

// Generic API methods
export const get = (url: string, params = {}) => {
  return ApiService.get(url, { params });
};

export const post = (url: string, data: any) => {
  return ApiService.post(url, data);
};

export const put = (url: string, data: any) => {
  return ApiService.put(url, data);
};

export const patch = (url: string, data: any) => {
  return ApiService.patch(url, data);
};

export const del = (url: string) => {
  return ApiService.delete(url);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

export default ApiService;