import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import ApiService from "../services/api";
import { setupTokenInterceptor } from "../utils/tokenUtils";
import { login as apiLogin, register as apiRegister } from "../services/api";

// interface User {
//   username: string;
//   email: string;
// }

export interface Profile {
  user: number; // base user info
  profile_pic: string | null;
  github_username: string | null;
  github_token: string | null;
  eco_credits: number;
  locked_credits: number;
  current_streak: number;
  longest_streak: number;
}

interface SignupData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: Profile | null;
  setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup token interceptor on app initialization
  useEffect(() => {
    setupTokenInterceptor();
  }, []);

  // Clear error message
  const clearError = useCallback(() => setError(null), []);

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userResponse = await ApiService.get("/profiles/me/");
          setUser(userResponse.data.data); // ✅ Profile
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await apiLogin(email, password);

      // always fetch full profile
      const userResponse = await ApiService.get("/profiles/me/");
      setUser(userResponse.data); // ✅ Profile

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await apiRegister(userData);

      const loginResponse = await ApiService.post("/token/", {
        email: userData.email,
        password: userData.password,
      });

      const { access } = loginResponse.data;
      localStorage.setItem("authToken", access);

      // fetch full profile after signup
      const userResponse = await ApiService.get("/profiles/me/");
      setUser(userResponse.data); // ✅ Profile

      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    clearError();
  };

  const isAuthenticated = !!user && !!localStorage.getItem("authToken");

  const value: AuthContextType = {
    user,
    setUser,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};