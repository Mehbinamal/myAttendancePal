
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type Subject = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string;
  subjectId: string;
  userId: string;
  date: string;
  status: "present" | "absent";
  note?: string;
};

type AttendanceContextType = {
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  addSubject: (name: string, description?: string) => void;
  updateSubject: (id: string, name: string, description?: string) => void;
  deleteSubject: (id: string) => void;
  markAttendance: (subjectId: string, date: string, status: "present" | "absent", note?: string) => void;
  getSubjectAttendance: (subjectId: string) => AttendanceRecord[];
  getAttendanceForDate: (date: string) => AttendanceRecord[];
  getAttendanceStats: (subjectId: string) => { present: number; absent: number; total: number; percentage: number };
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const SUBJECTS_STORAGE_KEY = "attendanceApp_subjects";
const ATTENDANCE_STORAGE_KEY = "attendanceApp_attendance";

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      // Load subjects for current user
      const storedSubjects = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]");
      setSubjects(storedSubjects.filter((subject: Subject) => subject.userId === user.id));

      // Load attendance records for current user
      const storedAttendance = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
      setAttendanceRecords(storedAttendance.filter((record: AttendanceRecord) => record.userId === user.id));
    } else {
      // Reset data when user logs out
      setSubjects([]);
      setAttendanceRecords([]);
    }
  }, [user]);

  // Subject operations
  const addSubject = (name: string, description?: string) => {
    if (!user) return;
    
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      description,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    // Update local state
    setSubjects([...subjects, newSubject]);
    
    // Update localStorage with all subjects (including from other users)
    const allSubjects = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]");
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify([...allSubjects, newSubject]));
    
    toast.success(`Subject "${name}" added successfully`);
  };

  const updateSubject = (id: string, name: string, description?: string) => {
    if (!user) return;
    
    // Update local state
    const updatedSubjects = subjects.map(subject => 
      subject.id === id ? { ...subject, name, description } : subject
    );
    setSubjects(updatedSubjects);
    
    // Update localStorage
    const allSubjects = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]");
    const updatedAllSubjects = allSubjects.map((subject: Subject) => 
      subject.id === id ? { ...subject, name, description } : subject
    );
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(updatedAllSubjects));
    
    toast.success(`Subject "${name}" updated successfully`);
  };

  const deleteSubject = (id: string) => {
    if (!user) return;
    
    // Get the subject name before deletion
    const subjectToDelete = subjects.find(subject => subject.id === id);
    if (!subjectToDelete) return;
    
    // Update local state
    setSubjects(subjects.filter(subject => subject.id !== id));
    
    // Also delete related attendance records
    const updatedRecords = attendanceRecords.filter(record => record.subjectId !== id);
    setAttendanceRecords(updatedRecords);
    
    // Update localStorage
    const allSubjects = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]");
    const allAttendance = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
    
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(allSubjects.filter((s: Subject) => s.id !== id)));
    localStorage.setItem(
      ATTENDANCE_STORAGE_KEY, 
      JSON.stringify(allAttendance.filter((a: AttendanceRecord) => a.subjectId !== id))
    );
    
    toast.success(`Subject "${subjectToDelete.name}" deleted successfully`);
  };

  // Attendance operations
  const markAttendance = (subjectId: string, date: string, status: "present" | "absent", note?: string) => {
    if (!user) return;
    
    // Check if an attendance record for this subject and date already exists
    const existingRecord = attendanceRecords.find(
      record => record.subjectId === subjectId && record.date === date
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedRecords = attendanceRecords.map(record => 
        record.id === existingRecord.id ? { ...record, status, note } : record
      );
      setAttendanceRecords(updatedRecords);
      
      // Update localStorage
      const allAttendance = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
      const updatedAllAttendance = allAttendance.map((record: AttendanceRecord) => 
        record.id === existingRecord.id ? { ...record, status, note } : record
      );
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updatedAllAttendance));
      
      toast.success("Attendance updated successfully");
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        subjectId,
        userId: user.id,
        date,
        status,
        note,
      };
      
      // Update local state
      setAttendanceRecords([...attendanceRecords, newRecord]);
      
      // Update localStorage
      const allAttendance = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify([...allAttendance, newRecord]));
      
      toast.success("Attendance marked successfully");
    }
  };

  const getSubjectAttendance = (subjectId: string) => {
    return attendanceRecords.filter(record => record.subjectId === subjectId);
  };

  const getAttendanceForDate = (date: string) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getAttendanceStats = (subjectId: string) => {
    const subjectAttendance = getSubjectAttendance(subjectId);
    const present = subjectAttendance.filter(record => record.status === "present").length;
    const absent = subjectAttendance.filter(record => record.status === "absent").length;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, total, percentage };
  };

  return (
    <AttendanceContext.Provider
      value={{
        subjects,
        attendanceRecords,
        addSubject,
        updateSubject,
        deleteSubject,
        markAttendance,
        getSubjectAttendance,
        getAttendanceForDate,
        getAttendanceStats,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
