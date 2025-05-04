
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const Subjects = () => {
  const [subjects] = useState([
    {
      id: 1,
      name: "Database Management",
      code: "CS301",
      schedule: "Monday, Wednesday 10:00 AM - 11:30 AM",
      attendance: { present: 12, absent: 2 }
    },
    {
      id: 2,
      name: "Web Development",
      code: "CS302",
      schedule: "Tuesday, Thursday 1:00 PM - 2:30 PM",
      attendance: { present: 10, absent: 3 }
    },
    {
      id: 3,
      name: "Data Structures",
      code: "CS201",
      schedule: "Monday, Wednesday 9:30 AM - 11:00 AM",
      attendance: { present: 14, absent: 0 }
    },
    {
      id: 4,
      name: "Algorithm Design",
      code: "CS202",
      schedule: "Tuesday, Friday 3:00 PM - 4:30 PM",
      attendance: { present: 8, absent: 4 }
    }
  ]);

  const calculateAttendancePercentage = (present, absent) => {
    const total = present + absent;
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const attendancePercentage = calculateAttendancePercentage(subject.attendance.present, subject.attendance.absent);
          
          return (
            <Card key={subject.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription className="mt-1">{subject.code}</CardDescription>
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 rounded-md ${
                    attendancePercentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {attendancePercentage}% Attendance
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">
                    {subject.schedule}
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium text-green-600">{subject.attendance.present}</span>{" "}
                      <span className="text-muted-foreground text-xs">Present</span>
                    </div>
                    <div>
                      <span className="font-medium text-red-600">{subject.attendance.absent}</span>{" "}
                      <span className="text-muted-foreground text-xs">Absent</span>
                    </div>
                    <div>
                      <span className="font-medium">{subject.attendance.present + subject.attendance.absent}</span>{" "}
                      <span className="text-muted-foreground text-xs">Total</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;
