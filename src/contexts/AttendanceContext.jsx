
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Reset data when user logs out
      setSubjects([]);
      setAttendance([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
  
    setIsLoading(true);
    try {
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);
  
      if (subjectError) throw new Error("Error loading subjects: " + subjectError.message);
  
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id);
  
      if (attendanceError) throw new Error("Error loading attendance: " + attendanceError.message);
  
      setSubjects(subjectData ?? []);
      setAttendance(attendanceData ?? []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load your data");
    } finally {
      setIsLoading(false);
    }
  };


  // Subject CRUD operations
  const addSubject = async (subject) => {
    const newSubject = {
      ...subject,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
  
    const { data, error } = await supabase
      .from("subjects")
      .insert([newSubject])
      .select();
  
    if (error) {
      toast.error("Failed to add subject");
      return;
    }
  
    setSubjects(prev => [...prev, data[0]]);
    toast.success("Subject added successfully");
    return data[0];
  };

  const updateSubject = async (id, updates) => {
    const { data,error} = await supabase
    .from("subjects")
    .update({...updates, updated_at: new Date().toISOString()})
    .eq("id",id)
    .eq("user_id",user.id)
    .select();
  
  if (error) {
    console.error("Error updating subject:", error);
    toast.error("Failed to update subject");
    return;
  }
  
  setSubjects(prev =>
    prev.map(subject => (subject.id === id ? data[0] : subject))
  );
  toast.success("Subject updated successfully");
  };

  const deleteSubject = async (id) => {
    // Delete the subject
    const { error: deleteSubjectError } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  
    if (deleteSubjectError) {
      console.error("Error deleting subject:", deleteSubjectError);
      toast.error("Failed to delete subject");
      return;
    }
  
    // Delete related attendance records
    const { error: deleteAttendanceError } = await supabase
      .from("attendance")
      .delete()
      .eq("subject_id", id)
      .eq("user_id", user.id);
  
    if (deleteAttendanceError) {
      console.error("Error deleting related attendance:", deleteAttendanceError);
      toast.error("Failed to delete attendance for subject");
      return;
    }
  
    // Update local state
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    setAttendance(prev => prev.filter(record => record.subjectId !== id));
  
    toast.success("Subject and related attendance deleted successfully");
  };

  // Attendance operations
  const addAttendance = async (record) => {
    const newRecord = {
      ...record,
      user_id: user.id,
      createdAt: new Date().toISOString()
    };
    const { data,error} = await supabase
      .from("attendance")
      .insert([newRecord])
      .select();

    if (error){
      toast.error("Failed to add attendance");
      return;
    }
    setAttendance(prev => [...prev, data[0]]);
    toast.success("Attendance recorded successfully");
    return data[0];
  };

  const updateAttendance = async (id, updates) => {
    const { data, error } = await supabase
      .from("attendance")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();
  
    if (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance");
      return;
    }
  
    setAttendance(prev =>
      prev.map(record => (record.id === id ? data[0] : record))
    );
    toast.success("Attendance updated successfully");
  };

const deleteAttendance = async (id) => {
  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting attendance:", error);
    toast.error("Failed to delete attendance");
    return;
  }

  setAttendance(prev => prev.filter(record => record.id !== id));
  toast.success("Attendance record deleted");
};

  // Add the missing getAttendanceForDate function
  const getAttendanceForDate = (date) => {
    return attendance.filter(record => record.date === date);
  };

  const getAttendanceBySubject = (subjectId) => {
    return attendance.filter(record => record.subjectId === subjectId);
  };

  const getSubjectById = (id) => {
    return subjects.find(subject => subject.id === id);
  };

  const getAttendanceStats = () => {
    const stats = {
      total: attendance.length,
      present: attendance.filter(record => record.status === 'present').length,
      absent: attendance.filter(record => record.status === 'absent').length,
      subjects: {}
    };
    
    // Calculate stats for each subject
    subjects.forEach(subject => {
      const subjectAttendance = getAttendanceBySubject(subject.id);
      const present = subjectAttendance.filter(record => record.status === 'present').length;
      const total = subjectAttendance.length;
      stats.subjects[subject.id] = {
        name: subject.name,
        total,
        present,
        absent: total - present,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });
    
    return stats;
  };

  return (
    <AttendanceContext.Provider value={{
      subjects,
      attendance,
      isLoading,
      addSubject,
      updateSubject,
      deleteSubject,
      addAttendance,
      updateAttendance,
      deleteAttendance,
      getAttendanceBySubject,
      getSubjectById,
      getAttendanceStats,
      getAttendanceForDate // Add the missing function to the context value
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
