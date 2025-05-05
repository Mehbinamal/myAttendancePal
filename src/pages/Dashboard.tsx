
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { MarkAttendanceDialog } from "@/components/MarkAttendanceDialog";

interface ClassInfo {
  subject: string;
  start_time: string;
  end_time: string;
  day: string;
}

const Dashboard: React.FC = () => {
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const { subjects, getAttendanceStats, isLoading } = useAttendance();
  const [todayClasses, setTodayClasses] = useState<ClassInfo[]>([]);
  
  console.log("Rendering Dashboard component", { subjectsLength: subjects?.length, isLoading });
  
  const stats = getAttendanceStats();
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];
  
  // Extract schedule information from subjects to build today's classes
  useEffect(() => {
    console.log("Dashboard useEffect running", { subjects });
    if (!subjects) return;
    
    // This just filters subjects with schedules that match today
    // In a real application, this would parse the schedule string properly
    const classesForToday = subjects
      .filter(subject => subject.schedule && subject.schedule.toLowerCase().includes(todayName.toLowerCase()))
      .map(subject => ({
        subject: subject.name,
        start_time: "09:00", // Default time since we don't have actual time parsing
        end_time: "10:30",  // Default time since we don't have actual time parsing
        day: todayName
      }));
    
    console.log("Today's classes:", classesForToday);
    setTodayClasses(classesForToday);
  }, [subjects, todayName]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setMarkAttendanceOpen(true)}
        >
          <CheckCircle className="h-4 w-4" />
          Mark Attendance
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Date</CardTitle>
            <CardDescription>
              {today.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span className="text-xl font-medium">{dayNames[today.getDay()]}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subjects</CardTitle>
            <CardDescription>Total registered subjects</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {subjects ? subjects.length : 0}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Attendance</CardTitle>
            <CardDescription>Your attendance rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {stats.total > 0 
                  ? `${Math.round((stats.present / stats.total) * 100)}%`
                  : "N/A"
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Schedule</h2>
        {todayClasses && todayClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayClasses.map((classItem, index) => (
              <Card key={index} className="flex justify-between items-center">
                <CardContent className="p-4 flex-1">
                  <h3 className="font-medium">{classItem.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    {classItem.start_time} - {classItem.end_time}
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button 
                    size="sm" 
                    onClick={() => setMarkAttendanceOpen(true)}
                  >
                    Mark
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No classes scheduled for today.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <MarkAttendanceDialog open={markAttendanceOpen} onOpenChange={setMarkAttendanceOpen} />
    </div>
  );
};

export default Dashboard;
