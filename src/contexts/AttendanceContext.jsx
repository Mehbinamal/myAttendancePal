import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
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
      console.log("User detected in AttendanceContext, loading data", user);
      loadData();
    } else {
      // Reset data when user logs out
      console.log("No user in AttendanceContext, resetting data");
      setSubjects([]);
      setAttendance([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadData = useCallback(async () => {
    if (!user) {
      console.log("No user available, skipping data load");
      setIsLoading(false);
      return;
    }
  
    console.log("Loading data for user:", user.id);
    setIsLoading(true);
    try {
      // Load subjects
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id);
  
      if (subjectError) {
        console.error("Error loading subjects:", subjectError);
        throw new Error("Error loading subjects: " + subjectError.message);
      }
      
      console.log("Loaded subjects:", subjectData);
  
      // Load attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id);
  
      if (attendanceError) {
        console.error("Error loading attendance:", attendanceError);
        throw new Error("Error loading attendance: " + attendanceError.message);
      }
  
      console.log("Loaded attendance:", attendanceData);
      
      // Calculate attendance counts for each subject
      const subjectsWithCounts = subjectData.map(subject => {
        const subjectAttendance = attendanceData.filter(record => 
          record.subject_id === subject.id
        );
        
        const present_count = subjectAttendance.filter(record => 
          record.status === 'present'
        ).length;
        
        const absent_count = subjectAttendance.filter(record => 
          record.status === 'absent'
        ).length;
        
        const not_taken_count = subjectAttendance.filter(record => 
          record.status === 'not_taken'
        ).length;
        
        return {
          ...subject,
          present_count,
          absent_count,
          not_taken_count
        };
      });
  
      setSubjects(subjectsWithCounts);
      setAttendance(attendanceData ?? []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load your data");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Subject CRUD operations
  const addSubject = async (subject) => {
    console.log("Adding subject:", subject, "for user:", user?.id);
    if (!user) {
      console.error("No user available to add subject");
      toast.error("You must be logged in to add a subject");
      return null;
    }

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
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject");
      throw error;
    }
    
    console.log("Subject added successfully:", data[0]);
    const subjectWithCounts = {
      ...data[0],
      present_count: 0,
      absent_count: 0,
      not_taken_count: 0
    };
  
    setSubjects(prev => [...prev, subjectWithCounts]);
    toast.success("Subject added successfully");
    return subjectWithCounts;
  };

  const updateSubject = async (id, updates) => {
    const { data, error } = await supabase
      .from("subjects")
      .update({...updates, updated_at: new Date().toISOString()})
      .eq("id", id)
      .eq("user_id", user.id)
      .select();
  
    if (error) {
      console.error("Error updating subject:", error);
      toast.error("Failed to update subject");
      return;
    }
  
    setSubjects(prev =>
      prev.map(subject => (subject.id === id ? data[0] : subject))
    );
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
    setAttendance(prev => prev.filter(record => record.subject_id !== id));
  
    toast.success("Subject and related attendance deleted successfully");
  };

  // Attendance operations
  const addAttendance = async (record) => {
    const newRecord = {
      ...record,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from("attendance")
      .insert([newRecord])
      .select();

    if (error){
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance");
      throw error;
    }
    
    // Update attendance records
    setAttendance(prev => [...prev, data[0]]);
    
    // Update subject counts
    setSubjects(prev => 
      prev.map(subject => {
        if (subject.id === record.subject_id) {
          const statusCountKey = `${record.status}_count`;
          return {
            ...subject,
            [statusCountKey]: (subject[statusCountKey] || 0) + 1
          };
        }
        return subject;
      })
    );
    
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
    return attendance.filter(record => record.subject_id === subjectId);
  };

  const getSubjectById = (id) => {
    return subjects.find(subject => subject.id === id);
  };

  const checkScheduleConflict = (newSchedule, subjectId = null) => {
    // Parse the new schedule into time slots
    const newTimeSlots = newSchedule.split(';').map(entry => {
      const match = entry.trim().match(/^(\w+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
      if (match) {
        const [_, day, startTime, endTime] = match;
        return {
          day: day.toLowerCase(),
          startTime,
          endTime
        };
      }
      return null;
    }).filter(Boolean);

    // Check each existing subject's schedule for conflicts
    for (const subject of subjects) {
      // Skip the subject being edited
      if (subjectId && subject.id === subjectId) continue;
      
      if (!subject.schedule) continue;

      const existingTimeSlots = subject.schedule.split(';').map(entry => {
        const match = entry.trim().match(/^(\w+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
        if (match) {
          const [_, day, startTime, endTime] = match;
          return {
            day: day.toLowerCase(),
            startTime,
            endTime
          };
        }
        return null;
      }).filter(Boolean);

      // Check for conflicts between new and existing time slots
      for (const newSlot of newTimeSlots) {
        for (const existingSlot of existingTimeSlots) {
          if (newSlot.day === existingSlot.day) {
            // Convert times to minutes for easier comparison
            const newStart = timeToMinutes(newSlot.startTime);
            const newEnd = timeToMinutes(newSlot.endTime);
            const existingStart = timeToMinutes(existingSlot.startTime);
            const existingEnd = timeToMinutes(existingSlot.endTime);

            // Check if there's any overlap
            if ((newStart < existingEnd && newEnd > existingStart)) {
              return {
                hasConflict: true,
                conflictingSubject: subject.name,
                day: newSlot.day,
                time: `${newSlot.startTime} - ${newSlot.endTime}`
              };
            }
          }
        }
      }
    }

    return { hasConflict: false };
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getAttendanceStats = () => {
    const stats = {
      total: attendance.length - attendance.filter(record => record.status === 'not_taken').length,
      present: attendance.filter(record => record.status === 'present').length,
      absent: attendance.filter(record => record.status === 'absent').length,
      not_taken: attendance.filter(record => record.status === 'not_taken').length,
      subjects: {}
    };
    
    // Calculate stats for each subject
    subjects.forEach(subject => {
      const subjectAttendance = getAttendanceBySubject(subject.id);
      const present = subjectAttendance.filter(record => record.status === 'present').length;
      const absent = subjectAttendance.filter(record => record.status === 'absent').length;
      const not_taken = subjectAttendance.filter(record => record.status === 'not_taken').length;
      const total = subjectAttendance.length - not_taken;
      const attendedTotal = total - not_taken; // Classes that were actually held
      
      stats.subjects[subject.id] = {
        name: subject.name,
        total,
        present,
        absent,
        not_taken,
        percentage: attendedTotal > 0 ? Math.round((present / attendedTotal) * 100) : 0
      };
    });
    
    return stats;
  };

  return (
    <AttendanceContext.Provider value={{
      subjects,
      attendance,
      isLoading,
      loadData,
      addSubject,
      updateSubject,
      deleteSubject,
      addAttendance,
      updateAttendance,
      deleteAttendance,
      getAttendanceBySubject,
      getSubjectById,
      getAttendanceStats,
      getAttendanceForDate,
      checkScheduleConflict
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
