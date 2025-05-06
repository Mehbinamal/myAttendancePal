
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import { useAttendance } from "@/contexts/AttendanceContext";

const AppLayout: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { loadData, isLoading: attendanceLoading } = useAttendance();
  const isMobile = useIsMobile();

  // Load attendance data when the layout mounts and user is authenticated
  useEffect(() => {
    console.log("AppLayout mounted, user:", user?.id);
    if (user) {
      console.log("Loading data from AppLayout");
      loadData();
    }
  }, [user, loadData]);

  if (authLoading || attendanceLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  console.log("Rendering AppLayout with Outlet");
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
