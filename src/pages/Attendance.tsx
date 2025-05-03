
import React, { useState, useEffect } from "react";
import { useAttendance, AttendanceRecord, Subject } from "@/contexts/AttendanceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format, parse, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AttendanceStatus = "present" | "absent";

const Attendance = () => {
  const { user } = useAuth();
  const { subjects, attendanceRecords, markAttendance, getSubjectAttendance, isLoading } = useAttendance();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("present");
  const [note, setNote] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("mark");
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  
  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  // Effect to handle URL params for direct access
  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    const dateParam = searchParams.get("date");
    const markParam = searchParams.get("mark") as AttendanceStatus | null;
    
    if (subjectParam && subjects.some(s => s.id === subjectParam)) {
      setSelectedSubject(subjectParam);
    } else if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].id);
    }
    
    if (dateParam) {
      const parsedDate = parse(dateParam, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
    
    if (markParam && (markParam === "present" || markParam === "absent")) {
      setSelectedStatus(markParam);
      setActiveTab("mark");
    }
    
    // Clear URL params after processing
    if (subjectParam || dateParam || markParam) {
      navigate("/attendance", { replace: true });
    }
  }, [searchParams, subjects, navigate]);

  const handleMarkAttendance = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }
    
    markAttendance(
      selectedSubject,
      format(selectedDate, "yyyy-MM-dd"),
      selectedStatus,
      note
    );
    
    setNote("");
  };
  
  // Get attendance records for the selected subject
  const subjectAttendance = selectedSubject 
    ? getSubjectAttendance(selectedSubject)
    : [];
    
  // Prepare data for calendar view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(viewMonth),
    end: endOfMonth(viewMonth)
  });
  
  const attendanceByDate = daysInMonth.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    const record = subjectAttendance.find(record => record.date === dateStr);
    return { date: day, record };
  });

  // Get the selected subject object
  const currentSubject = subjects.find(s => s.id === selectedSubject);
  
  // Check if there's an attendance record for the selected date and subject
  const existingRecord = subjectAttendance.find(
    record => record.date === format(selectedDate, "yyyy-MM-dd")
  );
  
  // Set status and note from existing record when a date is selected
  useEffect(() => {
    if (existingRecord) {
      setSelectedStatus(existingRecord.status);
      setNote(existingRecord.note || "");
    } else {
      setSelectedStatus("present");
      setNote("");
    }
  }, [existingRecord, selectedDate]);

  // Function to determine the date button style based on attendance status
  const getDateButtonStyle = (record: AttendanceRecord | undefined) => {
    if (!record) return "";
    
    return record.status === "present"
      ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300" 
      : "bg-red-100 hover:bg-red-200 text-red-800 border-red-300";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading attendance data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      </div>
      
      {subjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Subjects Available</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add subjects first to track attendance.
            </p>
            <Button onClick={() => navigate("/subjects")}>
              Add Subjects
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Label htmlFor="subject-select">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject-select" className="mt-1">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="view">View Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mark" className="mt-6">
              {selectedSubject ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="p-3 pointer-events-auto"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Mark Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Subject</Label>
                          <div className="mt-1 font-medium">{currentSubject?.name}</div>
                        </div>
                        
                        <div>
                          <Label>Date</Label>
                          <div className="mt-1 font-medium">
                            {format(selectedDate, "PPPP")}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <div className="flex space-x-2">
                            <Button 
                              type="button"
                              variant={selectedStatus === "present" ? "default" : "outline"}
                              className={`flex-1 ${selectedStatus === "present" ? "" : "hover:bg-green-50"}`}
                              onClick={() => setSelectedStatus("present")}
                            >
                              <Check className="h-4 w-4 mr-2" /> Present
                            </Button>
                            <Button 
                              type="button"
                              variant={selectedStatus === "absent" ? "default" : "outline"}
                              className={`flex-1 ${selectedStatus === "absent" ? "" : "hover:bg-red-50"}`}
                              onClick={() => setSelectedStatus("absent")}
                            >
                              <X className="h-4 w-4 mr-2" /> Absent
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="note">Note (Optional)</Label>
                          <Textarea
                            id="note"
                            placeholder="Add a note about this class..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={handleMarkAttendance}
                        >
                          {existingRecord ? "Update" : "Mark"} Attendance
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Please select a subject to mark attendance.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="view" className="mt-6">
              {selectedSubject ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Monthly View</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prevMonth = new Date(viewMonth);
                            prevMonth.setMonth(prevMonth.getMonth() - 1);
                            setViewMonth(prevMonth);
                          }}
                        >
                          &lt;
                        </Button>
                        <span className="text-sm font-medium">
                          {format(viewMonth, "MMMM yyyy")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextMonth = new Date(viewMonth);
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            setViewMonth(nextMonth);
                          }}
                        >
                          &gt;
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-xs font-medium py-1">
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells for days before the first day of month */}
                        {[...Array(startOfMonth(viewMonth).getDay())].map((_, i) => (
                          <div key={`empty-${i}`} className="p-2"></div>
                        ))}
                        
                        {/* Calendar days */}
                        {attendanceByDate.map(({ date, record }) => (
                          <Button
                            key={format(date, "yyyy-MM-dd")}
                            variant="outline"
                            size="sm"
                            className={`h-10 w-full text-center ${getDateButtonStyle(record)}`}
                            onClick={() => {
                              setSelectedDate(date);
                              setActiveTab("mark");
                            }}
                          >
                            <div className="flex flex-col items-center justify-center">
                              <span>{format(date, "d")}</span>
                              {record && (
                                <span className="text-xs mt-1">
                                  {record.status === "present" ? "P" : "A"}
                                </span>
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] overflow-y-auto">
                      {subjectAttendance.length > 0 ? (
                        <div className="space-y-2">
                          {[...subjectAttendance]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((record) => {
                              const recordDate = parse(record.date, "yyyy-MM-dd", new Date());
                              return (
                                <div 
                                  key={record.id}
                                  className="flex items-start p-3 rounded-md border"
                                  onClick={() => {
                                    const recordDate = parse(record.date, "yyyy-MM-dd", new Date());
                                    if (isValid(recordDate)) {
                                      setSelectedDate(recordDate);
                                      setActiveTab("mark");
                                    }
                                  }}
                                >
                                  <div className={`
                                    p-2 rounded-full mr-3
                                    ${record.status === "present" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-red-100 text-red-800"
                                    }
                                  `}>
                                    {record.status === "present" ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {format(recordDate, "PPPP")}
                                    </div>
                                    {record.note && (
                                      <div className="text-sm mt-1 text-muted-foreground">
                                        {record.note}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            No attendance records found for this subject.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Please select a subject to view attendance history.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Attendance;
