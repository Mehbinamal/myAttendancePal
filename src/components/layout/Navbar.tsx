
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = (path: string) => {
    return `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
      location.pathname === path
        ? "bg-primary text-primary-foreground"
        : "hover:bg-secondary"
    }`;
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-background backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AttendancePal</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={getLinkClass("/")}>
              Dashboard
            </Link>
            <Link to="/subjects" className={getLinkClass("/subjects")}>
              Subjects
            </Link>
            <Link to="/attendance" className={getLinkClass("/attendance")}>
              Attendance
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <span className="text-sm font-medium">Hi, {user?.name}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around py-2 px-2 z-50">
        <Link to="/" className="flex flex-col items-center p-2 flex-1">
          <Calendar className={`h-5 w-5 ${location.pathname === "/" ? "text-primary" : ""}`} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link to="/subjects" className="flex flex-col items-center p-2 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${location.pathname === "/subjects" ? "text-primary" : ""}`}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          <span className="text-xs mt-1">Subjects</span>
        </Link>
        <Link to="/attendance" className="flex flex-col items-center p-2 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${location.pathname === "/attendance" ? "text-primary" : ""}`}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="m9 16 2 2 4-4"></path>
          </svg>
          <span className="text-xs mt-1">Attendance</span>
        </Link>
        <div className="flex flex-col items-center p-2 flex-1">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
