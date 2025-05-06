
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle, XCircle, Ban } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";
import { MarkAttendanceDialog } from "@/components/MarkAttendanceDialog";

interface AttendanceRecord {
  id: string;
  subject: string;
  code: string;
  date: string;
  status: 'present' | 'absent' | 'not_taken';
  time: string;
  subject_id: string;
  created_at: string;
  hours: number;
  note: string | null;
  user_id: string;
}

const Attendance: React.FC = () => {
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const { attendance, subjects, isLoading } = useAttendance();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (attendance.length > 0 && subjects.length > 0) {
      // Transform data to match AttendanceRecord interface
      const formattedData = attendance.map(record => {
        const subject = subjects.find(s => s.id === record.subject_id);
        return {
          ...record,
          subject: subject?.name || "Unknown Subject",
          code: subject?.code || "---",
          time: new Date(record.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        } as AttendanceRecord;
      });

      setAttendanceRecords(formattedData);
    } else {
      setAttendanceRecords([]);
    }
  }, [attendance, subjects]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const AttendanceCard = ({ record }: { record: AttendanceRecord }) => (
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
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                record.status === "present"
                  ? "bg-green-100 text-green-800"
                  : record.status === "absent"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {record.status === "present" ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Present
                </>
              ) : record.status === "absent" ? (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Absent
                </>
              ) : (
                <>
                  <Ban className="h-3.5 w-3.5" /> Not Taken
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filterRecords = (status?: "present" | "absent" | "not_taken") =>
    status ? attendanceRecords.filter(r => r.status === status) : attendanceRecords;

  const getDateStr = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setMarkAttendanceOpen(true)}
        >
          <CheckCircle className="h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="present">Present</TabsTrigger>
          <TabsTrigger value="absent">Absent</TabsTrigger>
          <TabsTrigger value="not_taken">Not Taken</TabsTrigger>
        </TabsList>

        {/* All Records */}
        <TabsContent value="all" className="space-y-6">
          {["Today", "Yesterday", "Older"].map((label, i) => {
            const filterDate = getDateStr(i);
            const filtered = attendanceRecords.filter(r => {
              if (label === "Older") return r.date < getDateStr(2);
              return r.date === filterDate;
            });

            return (
              <div key={label} className="space-y-2">
                <h2 className="font-medium text-muted-foreground">{label}</h2>
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No records</p>
                  ) : (
                    filtered.map((record) => (
                      <AttendanceCard key={record.id} record={record} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* Present */}
        <TabsContent value="present" className="space-y-3">
          {filterRecords("present").length > 0 ? (
            filterRecords("present").map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No present records found.</p>
          )}
        </TabsContent>

        {/* Absent */}
        <TabsContent value="absent" className="space-y-3">
          {filterRecords("absent").length > 0 ? (
            filterRecords("absent").map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No absent records found.</p>
          )}
        </TabsContent>
        
        {/* Not Taken */}
        <TabsContent value="not_taken" className="space-y-3">
          {filterRecords("not_taken").length > 0 ? (
            filterRecords("not_taken").map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No 'class not taken' records found.</p>
          )}
        </TabsContent>
      </Tabs>

      <MarkAttendanceDialog open={markAttendanceOpen} onOpenChange={setMarkAttendanceOpen} />
    </div>
  );
};

export default Attendance;
