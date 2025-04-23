
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  demoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for when backend is not available
const DEMO_USER: User = {
  id: "demo-user-id",
  username: "Demo User",
  email: "demo@example.com"
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for token
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/users/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUser({
        id: userData._id,
        username: userData.username,
        email: userData.email,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // If there's an error fetching the profile, check if it's a connection error
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        handleBackendConnectionError();
      } else {
        // For other errors, logout
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackendConnectionError = () => {
    // Set to demo mode when backend is not available
    setDemoMode(true);
    setUser(DEMO_USER);
    
    toast({
      title: "Demo Mode Active",
      description: "Running in demo mode. Backend server is not available. Data is for demonstration only.",
      variant: "destructive",
    });
    
    console.warn("Backend connection failed. Running in demo mode.");
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setDemoMode(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        // If backend connection failed, login with demo user
        setUser(DEMO_USER);
        setDemoMode(true);
        localStorage.removeItem("token");
        
        toast({
          title: "Demo Mode Active",
          description: "Logged in as demo user. Backend server is not available.",
          variant: "destructive",
        });
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      }
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setDemoMode(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Failed to fetch")) {
        // If backend connection failed, register with demo user
        setUser(DEMO_USER);
        setDemoMode(true);
        localStorage.removeItem("token");
        
        toast({
          title: "Demo Mode Active",
          description: "Registered as demo user. Backend server is not available.",
          variant: "destructive",
        });
      } else {
        setError(err instanceof Error ? err.message : "Registration failed");
        throw err;
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setDemoMode(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error, demoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
