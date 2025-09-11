// services/api.ts
import axios from "axios";

// ---------- Config ----------
const API_BASE_URL =
  import.meta.env.VITE_API_URL 

const ApiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Interceptors ----------

// Attach token to all requests
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------- Types ----------

export interface LoginResponse {
  access: string;
}

export interface RegisterResponse {
  data: {
    email: string;
    username: string;
  };
}

export interface Profile {
  email: string;
  username: string;
  profile_pic?: string;
  // add more profile fields if needed
}

// export interface Profile {
//   success: boolean;
//   data: Profile;
// }

// ---------- Auth Helpers ----------

export const login = async (email: string, password: string): Promise<void> => {
  const response = await ApiService.post<LoginResponse>("/token/", { email, password });
  const { access } = response.data;
  localStorage.setItem("authToken", access);
  window.location.href = "/dashboard"; // redirect after login
};

export const register = async (userData: { email: string; password: string }) => {
  const response = await ApiService.post<RegisterResponse>("/users/", userData);
  const { email, username } = response.data.data;
  return { user: { email, username } };
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => !!localStorage.getItem("authToken");
export const getToken = (): string | null => localStorage.getItem("authToken");

// ---------- Profile Helpers ----------

export const getProfile = async (): Promise<Profile> => {
  const response = await ApiService.get<Profile>("/profiles/me/");
  return response.data;
};

export const updateProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await ApiService.patch<Profile>("/profiles/me/", profileData);
  return response.data;
};

export const uploadProfileImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("profile_pic", imageFile);

  const response = await ApiService.post<{ profile_pic_url: string }>(
    "/profiles/me/upload-image/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data.profile_pic_url;
};

// export const updateProfileWithImage = async (
//   profileData: Partial<Profile>,
//   imageFile?: File
// ): Promise<Profile> => {
//   let updatedProfile: Profile = { email: "", username: "" }; // default, will overwrite

//   if (Object.keys(profileData).length > 0) {
//     updatedProfile = await updateProfile(profileData);
//   }

//   if (imageFile) {
//     const imageUrl = await uploadProfileImage(imageFile);
//     updatedProfile = await updateProfile({ profile_pic: imageUrl });
//   }

//   return updatedProfile;
// };

// ---------- Generic API Methods ----------

export const get = async <T = any>(url: string, params = {}): Promise<T> => {
  const response = await ApiService.get<T>(url, { params });
  return response.data;
};

export const post = async <T = any>(url: string, data: any): Promise<T> => {
  const response = await ApiService.post<T>(url, data);
  return response.data;
};

export const put = async <T = any>(url: string, data: any): Promise<T> => {
  const response = await ApiService.put<T>(url, data);
  return response.data;
};

export const patch = async <T = any>(url: string, data: any): Promise<T> => {
  const response = await ApiService.patch<T>(url, data);
  return response.data;
};

export const del = async <T = any>(url: string): Promise<T> => {
  const response = await ApiService.delete<T>(url);
  return response.data;
};

// ---------- Export Default ----------

export default ApiService;
