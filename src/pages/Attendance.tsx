
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";

interface AttendanceRecord {
  id: number;
  subject: string;
  code: string;
  date: string;
  status: 'present' | 'absent';
  time: string;
}

interface AttendanceCardProps {
  record: AttendanceRecord;
}

const Attendance: React.FC = () => {
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 1,
      subject: "Database Management",
      code: "CS301",
      date: "2025-05-03",
      status: "present",
      time: "10:00 AM - 11:30 AM"
    },
    {
      id: 2,
      subject: "Web Development",
      code: "CS302",
      date: "2025-05-03",
      status: "present",
      time: "1:00 PM - 2:30 PM"
    },
    {
      id: 3,
      subject: "Data Structures",
      code: "CS201",
      date: "2025-05-02",
      status: "present",
      time: "9:30 AM - 11:00 AM"
    },
    {
      id: 4,
      subject: "Algorithm Design",
      code: "CS202",
      date: "2025-05-02",
      status: "absent",
      time: "3:00 PM - 4:30 PM"
    },
    {
      id: 5,
      subject: "Database Management",
      code: "CS301",
      date: "2025-05-01",
      status: "present",
      time: "10:00 AM - 11:30 AM"
    },
  ]);

  const getTodayRecords = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.filter(record => record.date === today);
  };

  const getYesterdayRecords = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return attendanceRecords.filter(record => record.date === yesterdayStr);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance Records</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="present">Present</TabsTrigger>
          <TabsTrigger value="absent">Absent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-medium text-muted-foreground">Today</h2>
            <div className="space-y-3">
              {attendanceRecords
                .filter(record => record.date === "2025-05-03")
                .map(record => (
                  <AttendanceCard key={record.id} record={record} />
                ))
              }
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-muted-foreground">Yesterday</h2>
            <div className="space-y-3">
              {attendanceRecords
                .filter(record => record.date === "2025-05-02")
                .map(record => (
                  <AttendanceCard key={record.id} record={record} />
                ))
              }
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-muted-foreground">Older</h2>
            <div className="space-y-3">
              {attendanceRecords
                .filter(record => record.date === "2025-05-01")
                .map(record => (
                  <AttendanceCard key={record.id} record={record} />
                ))
              }
            </div>
          </div>
        </TabsContent>

        <TabsContent value="present" className="space-y-3">
          {attendanceRecords
            .filter(record => record.status === "present")
            .map(record => (
              <AttendanceCard key={record.id} record={record} />
            ))
          }
        </TabsContent>

        <TabsContent value="absent" className="space-y-3">
          {attendanceRecords
            .filter(record => record.status === "absent")
            .map(record => (
              <AttendanceCard key={record.id} record={record} />
            ))
          }
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AttendanceCard: React.FC<AttendanceCardProps> = ({ record }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{record.subject}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(record.date)} | {record.time}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span 
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                record.status === "present" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
              }`}
            >
              {record.status === "present" ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Present
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Absent
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Attendance;
