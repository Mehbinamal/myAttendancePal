
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowMobileProfile(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Skip rendering if we're on the login, signup, or welcome page
  if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/") {
    return null;
  }

  return (
    <nav className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center">
            <Calendar className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-lg">AttendancePal</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className={`px-4 py-2 rounded-md ${isActive("/dashboard") ? "bg-primary text-white" : "text-foreground"}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/dashboard/subjects" 
            className={`px-4 py-2 rounded-md ${isActive("/dashboard/subjects") ? "bg-primary text-white" : "text-foreground"}`}
          >
            Subjects
          </Link>
          <Link 
            to="/dashboard/attendance" 
            className={`px-4 py-2 rounded-md ${isActive("/dashboard/attendance") ? "bg-primary text-white" : "text-foreground"}`}
          >
            Attendance
          </Link>
          
          <div className="flex items-center gap-4 ml-4 border-l border-border pl-4">
            {user && <span className="text-sm">Hi, {user?.name}</span>}
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around py-2 z-50">
        <Link to="/dashboard" className="flex flex-col items-center p-2 flex-1">
          <Calendar className={`h-5 w-5 ${location.pathname === "/dashboard" ? "text-primary" : ""}`} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link to="/dashboard/subjects" className="flex flex-col items-center p-2 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${location.pathname === "/dashboard/subjects" ? "text-primary" : ""}`}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          <span className="text-xs mt-1">Subjects</span>
        </Link>
        <Link to="/dashboard/attendance" className="flex flex-col items-center p-2 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${location.pathname === "/dashboard/attendance" ? "text-primary" : ""}`}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="m9 16 2 2 4-4"></path>
          </svg>
          <span className="text-xs mt-1">Attendance</span>
        </Link>
        
        {/* Profile button with Sheet */}
        <Sheet open={showMobileProfile} onOpenChange={setShowMobileProfile}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center p-2 flex-1">
              <User className={`h-5 w-5 ${showMobileProfile ? "text-primary" : ""}`} />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto pb-12">
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Your Profile</SheetTitle>
            </SheetHeader>
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <Separator className="my-4" />
                <Button 
                  variant="destructive" 
                  onClick={handleLogout} 
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p>Not logged in</p>
                <Button onClick={() => navigate("/login")} className="mt-2">
                  Login
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
