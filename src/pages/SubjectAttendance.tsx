import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CheckCircle, XCircle, Ban, ArrowLeft } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { MarkAttendanceDialog } from "@/components/MarkAttendanceDialog";
import { EditAttendanceDialog } from "@/components/EditAttendanceDialog";
import { toast } from "sonner";

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

const SubjectAttendance: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const { attendance, subjects, getSubjectById } = useAttendance();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (subjectId && subjects.length > 0) {
      const foundSubject = getSubjectById(subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
      } else {
        toast.error("Subject not found");
        navigate('/dashboard/subjects');
      }
    }
  }, [subjectId, subjects, getSubjectById, navigate]);

  useEffect(() => {
    if (subjectId && attendance.length > 0 && subjects.length > 0) {
      // Filter attendance records for the specific subject
      const subjectRecords = attendance.filter(record => record.subject_id === subjectId);
      
      // Transform data to match AttendanceRecord interface
      const formattedData = subjectRecords.map(record => {
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

      // Sort by date (newest first)
      formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAttendanceRecords(formattedData);
    } else {
      setAttendanceRecords([]);
    }
  }, [attendance, subjects, subjectId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateStats = () => {
    const total = attendanceRecords.filter(r => r.status !== 'not_taken').length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const notTaken = attendanceRecords.filter(r => r.status === 'not_taken').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, notTaken, percentage };
  };

  const stats = calculateStats();

  const filterRecords = (status?: "present" | "absent" | "not_taken") =>
    status ? attendanceRecords.filter(r => r.status === status) : attendanceRecords;

  const getStatusBadge = (status: 'present' | 'absent' | 'not_taken') => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-green-100 text-green-800">
            <CheckCircle className="h-3.5 w-3.5" /> Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-red-100 text-red-800">
            <XCircle className="h-3.5 w-3.5" /> Absent
          </span>
        );
      case 'not_taken':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-yellow-100 text-yellow-800">
            <Ban className="h-3.5 w-3.5" /> Not Taken
          </span>
        );
    }
  };

  const handleEditAttendance = (recordId: string) => {
    setSelectedAttendanceId(recordId);
    setMarkAttendanceOpen(true);
  };

  const handleAddAttendance = () => {
    setSelectedAttendanceId(null);
    setMarkAttendanceOpen(true);
  };

  const handleBack = () => {
    navigate('/dashboard/subjects');
  };

  if (!subject) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{subject.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
          <p className="text-muted-foreground">{subject.code}</p>
          {subject.schedule && (
            <p className="text-muted-foreground flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {subject.schedule}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className={`text-2xl font-bold ${stats.percentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                {stats.percentage}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Attendance Records</h2>
        <Button onClick={handleAddAttendance}>
          <CheckCircle className="h-4 w-4 mr-2" />
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

        <TabsContent value="all">
          <AttendanceTable 
            records={attendanceRecords} 
            getStatusBadge={getStatusBadge} 
            formatDate={formatDate} 
            onEdit={handleEditAttendance}
          />
        </TabsContent>

        <TabsContent value="present">
          <AttendanceTable 
            records={filterRecords("present")} 
            getStatusBadge={getStatusBadge} 
            formatDate={formatDate} 
            onEdit={handleEditAttendance}
          />
        </TabsContent>

        <TabsContent value="absent">
          <AttendanceTable 
            records={filterRecords("absent")} 
            getStatusBadge={getStatusBadge} 
            formatDate={formatDate} 
            onEdit={handleEditAttendance}
          />
        </TabsContent>
        
        <TabsContent value="not_taken">
          <AttendanceTable 
            records={filterRecords("not_taken")} 
            getStatusBadge={getStatusBadge} 
            formatDate={formatDate} 
            onEdit={handleEditAttendance}
          />
        </TabsContent>
      </Tabs>

      <MarkAttendanceDialog 
        open={markAttendanceOpen} 
        onOpenChange={setMarkAttendanceOpen} 
        preSelectedSubject={subjectId}
      />
    </div>
  );
};

interface AttendanceTableProps {
  records: AttendanceRecord[];
  getStatusBadge: (status: 'present' | 'absent' | 'not_taken') => JSX.Element;
  formatDate: (dateString: string) => string;
  onEdit: (recordId: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, getStatusBadge, formatDate, onEdit }) => {
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">No attendance records found.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>{record.hours}</TableCell>
              <TableCell>{record.note || '-'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(record.id)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubjectAttendance;
