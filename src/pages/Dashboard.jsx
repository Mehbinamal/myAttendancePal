
import React from "react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Subjects</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
          </div>
          <div className="text-3xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">Current Semester</p>
        </Card>
        
        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Attendance Rate</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
          </div>
          <div className="text-3xl font-bold">87%</div>
          <p className="text-xs text-muted-foreground">Overall attendance</p>
        </Card>
        
        <Card className="p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Classes Today</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
              <path d="m9 16 2 2 4-4"></path>
            </svg>
          </div>
          <div className="text-3xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">Remaining classes: 1</p>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Database Management</h4>
                <p className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</p>
              </div>
              <div className="text-sm text-primary font-medium">
                Today
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Web Development</h4>
                <p className="text-sm text-muted-foreground">1:00 PM - 2:30 PM</p>
              </div>
              <div className="text-sm text-primary font-medium">
                Today
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Data Structures</h4>
                <p className="text-sm text-muted-foreground">9:30 AM - 11:00 AM</p>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Tomorrow
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
