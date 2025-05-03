
import React, { useState } from "react";
import { useAttendance, Subject } from "@/contexts/AttendanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { subjects, attendanceRecords, getAttendanceStats, getAttendanceForDate, isLoading } = useAttendance();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  
  const todaysAttendance = getAttendanceForDate(formattedDate);

  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Sort subjects by attendance percentage
  const sortedSubjects = [...subjects].sort((a, b) => {
    const statsA = getAttendanceStats(a.id);
    const statsB = getAttendanceStats(b.id);
    return statsB.percentage - statsA.percentage;
  });

  const subjectsWithNoAttendanceToday = subjects.filter(
    subject => !todaysAttendance.some(record => record.subject_id === subject.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {selectedDate ? format(selectedDate, "PP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Get Started</h3>
            <p className="text-muted-foreground text-center mb-6">
              You don't have any subjects yet. Add your first subject to start tracking attendance.
            </p>
            <Button onClick={() => navigate("/subjects")}>
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Your overall attendance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Subjects</span>
                    <span className="font-medium">{subjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Classes</span>
                    <span className="font-medium">{attendanceRecords.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      <span>Present</span>
                    </div>
                    <span className="font-medium">
                      {attendanceRecords.filter(record => record.status === "present").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <X className="h-4 w-4 mr-1 text-red-500" />
                      <span>Absent</span>
                    </div>
                    <span className="font-medium">
                      {attendanceRecords.filter(record => record.status === "absent").length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Attendance percentage by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedSubjects.length > 0 ? (
                  sortedSubjects.map((subject) => {
                    const stats = getAttendanceStats(subject.id);
                    return (
                      <div key={subject.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-sm">
                            {stats.present}/{stats.total} ({stats.percentage}%)
                          </span>
                        </div>
                        <Progress value={stats.percentage} className="h-2" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No subjects available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {subjectsWithNoAttendanceToday.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-10">
            <h2 className="text-xl font-semibold">
              Mark Today's Attendance
            </h2>
            <Button size="sm" onClick={() => navigate("/attendance")}>
              View All
            </Button>
          </div>
          <Separator className="my-2" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjectsWithNoAttendanceToday.map((subject) => (
              <Card key={subject.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex justify-between gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-200"
                      onClick={() => navigate(`/attendance?subject=${subject.id}&date=${formattedDate}&mark=present`)}
                    >
                      <Check className="h-4 w-4 mr-2" /> Present
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-200"
                      onClick={() => navigate(`/attendance?subject=${subject.id}&date=${formattedDate}&mark=absent`)}
                    >
                      <X className="h-4 w-4 mr-2" /> Absent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
