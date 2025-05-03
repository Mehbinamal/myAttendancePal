
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

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

  // Load data from localStorage
  const loadData = () => {
    try {
      if (!user) return;
      
      setIsLoading(true);
      
      // Load subjects
      const storedSubjects = localStorage.getItem(`subjects_${user.id}`);
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }
      
      // Load attendance records
      const storedAttendance = localStorage.getItem(`attendance_${user.id}`);
      if (storedAttendance) {
        setAttendance(JSON.parse(storedAttendance));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load your data");
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to localStorage
  const saveData = (type, data) => {
    if (!user) return;
    
    try {
      if (type === 'subjects') {
        localStorage.setItem(`subjects_${user.id}`, JSON.stringify(data));
        setSubjects(data);
      } else if (type === 'attendance') {
        localStorage.setItem(`attendance_${user.id}`, JSON.stringify(data));
        setAttendance(data);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      toast.error(`Failed to save ${type}`);
    }
  };

  // Subject CRUD operations
  const addSubject = (subject) => {
    const newSubject = {
      id: Date.now().toString(),
      ...subject,
      createdAt: new Date().toISOString()
    };
    const updatedSubjects = [...subjects, newSubject];
    saveData('subjects', updatedSubjects);
    toast.success("Subject added successfully");
    return newSubject;
  };

  const updateSubject = (id, updates) => {
    const updatedSubjects = subjects.map(subject => 
      subject.id === id ? { ...subject, ...updates, updatedAt: new Date().toISOString() } : subject
    );
    saveData('subjects', updatedSubjects);
    toast.success("Subject updated successfully");
  };

  const deleteSubject = (id) => {
    // Delete subject
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    saveData('subjects', updatedSubjects);
    
    // Also delete related attendance records
    const updatedAttendance = attendance.filter(record => record.subjectId !== id);
    saveData('attendance', updatedAttendance);
    
    toast.success("Subject deleted successfully");
  };

  // Attendance operations
  const addAttendance = (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      createdAt: new Date().toISOString()
    };
    const updatedAttendance = [...attendance, newRecord];
    saveData('attendance', updatedAttendance);
    toast.success("Attendance recorded successfully");
    return newRecord;
  };

  const updateAttendance = (id, updates) => {
    const updatedAttendance = attendance.map(record => 
      record.id === id ? { ...record, ...updates, updatedAt: new Date().toISOString() } : record
    );
    saveData('attendance', updatedAttendance);
    toast.success("Attendance updated successfully");
  };

  const deleteAttendance = (id) => {
    const updatedAttendance = attendance.filter(record => record.id !== id);
    saveData('attendance', updatedAttendance);
    toast.success("Attendance record deleted");
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
      getAttendanceStats
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
