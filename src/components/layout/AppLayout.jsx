
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";

const AppLayout = () => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className={`container mx-auto px-4 py-6 flex-grow ${isMobile ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
