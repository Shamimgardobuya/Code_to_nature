// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import type { ReactNode } from "react";
// import ApiService from "../services/api";
// import { setupTokenInterceptor } from "../utils/tokenUtils";
// import { login as apiLogin, register as apiRegister } from "../services/api";

// export interface Profile {
//   user: number; // base user info
//   profile_pic: string | null;
//   github_username: string | null;
//   github_token: string | null;
//   eco_credits: number;
//   locked_credits: number;
//   current_streak: number;
//   longest_streak: number;
// }

// interface SignupData {
//   email: string;
//   password: string;
// }

// interface AuthContextType {
//   user: Profile | null;
//   setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (userData: SignupData) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
//   clearError: () => void;
// }

// // Response types
// interface UserResponse {
//   data: Profile;
// }

// interface LoginResponse {
//   access: string;
//   refresh?: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Setup token interceptor on app initialization
//   useEffect(() => {
//     setupTokenInterceptor();
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   // Check for existing session
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (token) {
//           const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
//           setUser(userResponse.data.data);
//         }
//       } catch (err) {
//         console.error("Failed to initialize auth:", err);
//         localStorage.removeItem("authToken");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setLoading(true);
//     clearError();
//     try {
//       await apiLogin(email, password);

//       const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
//       setUser(userResponse.data.data);

//       setLoading(false);
//       return true;
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       setError(err.message || "Login failed. Please check your credentials.");
//       setLoading(false);
//       return false;
//     }
//   };

//   const signup = async (userData: SignupData): Promise<boolean> => {
//     setLoading(true);
//     clearError();
//     try {
//       await apiRegister(userData);

//       const loginResponse = await ApiService.post<LoginResponse>("/token/", {
//         email: userData.email,
//         password: userData.password,
//       });

//       const { access } = loginResponse.data;
//       localStorage.setItem("authToken", access);

//       const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
//       setUser(userResponse.data.data);

//       setLoading(false);
//       return true;
//     } catch (err: any) {
//       console.error("Signup failed:", err);
//       setError(err.message || "Signup failed. Please try again.");
//       setLoading(false);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//     clearError();
//   };

//   const isAuthenticated = !!user && !!localStorage.getItem("authToken");

//   return (
//     <AuthContext.Provider
//       value={{ user, setUser, login, signup, logout, isAuthenticated, loading, error, clearError }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
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

export interface Profile {
  user: number;
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

// Response types
interface UserResponse {
  data: any; // API returns raw object
}

interface LoginResponse {
  access: string;
  refresh?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Helper to map API response to Profile type
const mapToProfile = (data: any): Profile => ({
  user: data.id,
  profile_pic: data.profile_pic ?? null,
  github_username: data.github_username ?? null,
  github_token: data.github_token ?? null,
  eco_credits: data.eco_credits ?? 0,
  locked_credits: data.locked_credits ?? 0,
  current_streak: data.current_streak ?? 0,
  longest_streak: data.longest_streak ?? 0,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup token interceptor
  useEffect(() => {
    setupTokenInterceptor();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
          setUser(mapToProfile(userResponse.data));
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
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

      const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
      setUser(mapToProfile(userResponse.data));

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    clearError();
    try {
      await apiRegister(userData);

      const loginResponse = await ApiService.post<LoginResponse>("/token/", {
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem("authToken", loginResponse.data.access);

      const userResponse = await ApiService.get<UserResponse>("/profiles/me/");
      setUser(mapToProfile(userResponse.data));

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed. Please try again.");
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

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, isAuthenticated, loading, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
