
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For demo purposes, we'll use localStorage to persist the user
const LOCAL_STORAGE_KEY = "attendanceApp_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // This is a mock implementation - in a real app, this would call a backend API
      if (email && password) {
        // Check if the user exists in localStorage (for demo purposes)
        const users = JSON.parse(localStorage.getItem("attendanceApp_users") || "[]");
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
          };
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
          toast.success("Login successful!");
          return true;
        } else {
          toast.error("Invalid email or password");
          return false;
        }
      }
      
      toast.error("Please provide email and password");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // This is a mock implementation - in a real app, this would call a backend API
      if (name && email && password) {
        // Get existing users or initialize empty array
        const existingUsers = JSON.parse(localStorage.getItem("attendanceApp_users") || "[]");
        
        // Check if email is already in use
        if (existingUsers.some((u: any) => u.email === email)) {
          toast.error("Email already in use");
          return false;
        }
        
        // Create new user
        const newUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
        };
        
        // Add user to "database"
        existingUsers.push(newUser);
        localStorage.setItem("attendanceApp_users", JSON.stringify(existingUsers));
        
        // Set current user (without password)
        const userData = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        };
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        
        toast.success("Account created successfully!");
        return true;
      }
      
      toast.error("Please fill all required fields");
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
