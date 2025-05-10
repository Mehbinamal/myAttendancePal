import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      // First check if user already exists using auth API
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check', // This will fail if user exists
      });

      // If we get a specific error, it means the user exists
      if (checkError && checkError.message.includes('Invalid login credentials')) {
        toast.error("A user with this email already exists");
        return false;
      }

      // If we get any other error, proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      const user = data.user;

      if (user) {
        const userToStore = {
          id: user.id,
          email: user.email,
          name: name,
        };
        localStorage.setItem("user", JSON.stringify(userToStore));
        setUser(userToStore);
        toast.success("Account created successfully!");
        return true;
      }
  
      return false;

    }catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
      return false;
    }
  };

  const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return false;
    }

    const user = data.user;

    if (user) {
      const userToStore = {
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name || "",
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      toast.success("Login successful!");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Failed to log in");
    return false;
  }
};


const logout = async () => {
  await supabase.auth.signOut();
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
