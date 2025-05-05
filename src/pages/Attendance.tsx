
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceRecord {
  id: string;
  subject: string;
  code: string;
  date: string;
  status: 'present' | 'absent';
  time: string;
  subject_id: string;
  created_at: string;
  hours: number;
  note: string | null;
  user_id: string;
}

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // Get attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*, subjects(name)")
          .eq("user_id", user.id);

        if (attendanceError) throw attendanceError;

        // Transform data to match AttendanceRecord interface
        const formattedData = attendanceData.map(record => {
          const subject = record.subjects?.name || "Unknown Subject";
          return {
            ...record,
            subject,
            code: record.subjects?.name.substring(0, 3).toUpperCase() || "---",
            time: new Date(record.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          } as AttendanceRecord;
        });

        setAttendanceRecords(formattedData);
      } catch (error) {
        console.error("Error loading attendance:", error);
        toast.error("Failed to load attendance records");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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

  const filterRecords = (status?: "present" | "absent") =>
    status ? attendanceRecords.filter(r => r.status === status) : attendanceRecords;

  const getDateStr = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return date.toISOString().split("T")[0];
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
          {filterRecords("present").map((record) => (
            <AttendanceCard key={record.id} record={record} />
          ))}
        </TabsContent>

        {/* Absent */}
        <TabsContent value="absent" className="space-y-3">
          {filterRecords("absent").map((record) => (
            <AttendanceCard key={record.id} record={record} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
