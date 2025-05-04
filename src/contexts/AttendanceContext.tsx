
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type Subject = {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  subject_id: string;
  user_id: string;
  date: string;
  status: "present" | "absent";
  note?: string;
  hours: number;
};

type AttendanceContextType = {
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
  addSubject: (name: string, description?: string) => Promise<void>;
  updateSubject: (id: string, name: string, description?: string) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  markAttendance: (subjectId: string, date: string, status: "present" | "absent", hours: number, note?: string) => Promise<void>;
  getSubjectAttendance: (subjectId: string) => AttendanceRecord[];
  getAttendanceForDate: (date: string) => AttendanceRecord[];
  getAttendanceStats: (subjectId: string) => { present: number; absent: number; totalHours: number; presentHours: number; percentage: number };
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Reset data when user logs out
      setSubjects([]);
      setAttendanceRecords([]);
      setIsLoading(false);
    }
  }, [user]);

  // Load data from Supabase
  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (subjectsError) {
        throw subjectsError;
      }
      
      // Load attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*');
      
      if (attendanceError) {
        throw attendanceError;
      }
      
      setSubjects(subjectsData);
      
      // Ensure status is 'present' or 'absent' - handle type casting
      const typedAttendanceRecords = attendanceData.map(record => ({
        ...record,
        status: record.status === 'present' ? 'present' : 'absent',
        hours: record.hours || 1.0
      } as AttendanceRecord));
      
      setAttendanceRecords(typedAttendanceRecords);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load your data");
    } finally {
      setIsLoading(false);
    }
  };

  // Subject operations
  const addSubject = async (name: string, description?: string) => {
    if (!user) return;
    
    try {
      const newSubject = {
        name,
        description,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('subjects')
        .insert(newSubject)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSubjects([data, ...subjects]);
      toast.success(`Subject "${name}" added successfully`);
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject");
    }
  };

  const updateSubject = async (id: string, name: string, description?: string) => {
    if (!user) return;
    
    try {
      const updates = {
        name,
        description,
      };
      
      const { error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSubjects(subjects.map(subject => 
        subject.id === id ? { ...subject, ...updates } : subject
      ));
      
      toast.success(`Subject "${name}" updated successfully`);
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Failed to update subject");
    }
  };

  const deleteSubject = async (id: string) => {
    if (!user) return;
    
    try {
      // Get the subject name before deletion
      const subjectToDelete = subjects.find(subject => subject.id === id);
      if (!subjectToDelete) return;
      
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setSubjects(subjects.filter(subject => subject.id !== id));
      
      // Attendance records will be automatically deleted by the ON DELETE CASCADE constraint
      setAttendanceRecords(attendanceRecords.filter(record => record.subject_id !== id));
      
      toast.success(`Subject "${subjectToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

  // Attendance operations
  const markAttendance = async (subjectId: string, date: string, status: "present" | "absent", hours: number, note?: string) => {
    if (!user) return;
    
    try {
      // Check if an attendance record for this subject and date already exists
      const existingRecord = attendanceRecords.find(
        record => record.subject_id === subjectId && record.date === date
      );
      
      if (existingRecord) {
        // Update existing record
        const updates = {
          status,
          note,
          hours
        };
        
        const { error } = await supabase
          .from('attendance')
          .update(updates)
          .eq('id', existingRecord.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state with type safety
        setAttendanceRecords(attendanceRecords.map(record => 
          record.id === existingRecord.id ? { ...record, ...updates } : record
        ));
        
        toast.success("Attendance updated successfully");
      } else {
        // Create new record
        const newRecord = {
          subject_id: subjectId,
          user_id: user.id,
          date,
          status,
          note,
          hours
        };
        
        const { data, error } = await supabase
          .from('attendance')
          .insert(newRecord)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        // Add to local state with type safety
        setAttendanceRecords([...attendanceRecords, {
          ...data,
          status: data.status as "present" | "absent"
        }]);
        
        toast.success("Attendance marked successfully");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  const getSubjectAttendance = (subjectId: string) => {
    return attendanceRecords.filter(record => record.subject_id === subjectId);
  };

  const getAttendanceForDate = (date: string) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getAttendanceStats = (subjectId: string) => {
    const subjectAttendance = getSubjectAttendance(subjectId);
    const presentRecords = subjectAttendance.filter(record => record.status === "present");
    const absentRecords = subjectAttendance.filter(record => record.status === "absent");
    
    const present = presentRecords.length;
    const absent = absentRecords.length;
    
    // Calculate hours
    const presentHours = presentRecords.reduce((total, record) => total + record.hours, 0);
    const absentHours = absentRecords.reduce((total, record) => total + record.hours, 0);
    const totalHours = presentHours + absentHours;
    
    // Calculate percentage based on hours present
    const percentage = totalHours > 0 ? Math.round((presentHours / totalHours) * 100) : 0;
    
    return { present, absent, totalHours, presentHours, percentage };
  };

  return (
    <AttendanceContext.Provider
      value={{
        subjects,
        attendanceRecords,
        isLoading,
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
