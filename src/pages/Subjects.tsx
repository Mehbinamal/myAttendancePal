import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { useNavigate } from "react-router-dom";

const Subjects: React.FC = () => {
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const { subjects, isLoading } = useAttendance();
  const navigate = useNavigate();

  console.log("Rendering Subjects component with:", { subjects, isLoading });

  const calculateAttendancePercentage = (present: number, absent: number) => {
    const total = present + absent;
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  const handleViewDetails = (subjectId: string) => {
    navigate(`/dashboard/subjects/${subjectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setAddSubjectOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!subjects || subjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any subjects yet.</p>
              <Button 
                variant="outline" 
                onClick={() => setAddSubjectOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add your first subject
              </Button>
            </div>
          ) : (
            subjects.map((subject) => {
              const present = subject.present_count || 0;
              const absent = subject.absent_count || 0;
              const percentage = calculateAttendancePercentage(present, absent);

              return (
                <Card key={subject.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{subject.name}</CardTitle>
                        <CardDescription className="mt-1">{subject.code}</CardDescription>
                      </div>
                      <div className={`text-sm font-medium px-2 py-1 rounded-md ${
                        percentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {percentage}% Attendance
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{subject.schedule}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-600">{present}</span>{" "}
                        <span className="text-muted-foreground text-xs">Present</span>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">{absent}</span>{" "}
                        <span className="text-muted-foreground text-xs">Absent</span>
                      </div>
                      <div>
                        <span className="font-medium">{present + absent}</span>{" "}
                        <span className="text-muted-foreground text-xs">Total</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(subject.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      <AddSubjectDialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen} />
    </div>
  );
};

export default Subjects;
