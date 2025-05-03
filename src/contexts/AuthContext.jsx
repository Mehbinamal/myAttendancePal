
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some(user => user.email === email);
      
      if (userExists) {
        toast.error("User with this email already exists");
        return false;
      }
      
      // Create new user
      const newUser = { id: Date.now().toString(), name, email, password };
      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      
      // Auto login after signup
      const userToStore = { id: newUser.id, name, email };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check credentials against stored users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        toast.error("Invalid email or password");
        return false;
      }
      
      // Store user data (without password) in localStorage and state
      const userToStore = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
