
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreVertical, Pencil, Trash } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { EditSubjectDialog } from "@/components/EditSubjectDialog";
import { DeleteSubjectDialog } from "@/components/DeleteSubjectDialog";
import { useNavigate } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Subjects: React.FC = () => {
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [editSubjectOpen, setEditSubjectOpen] = useState(false);
  const [deleteSubjectOpen, setDeleteSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
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

  const handleEdit = (subject: any) => {
    setSelectedSubject(subject);
    setEditSubjectOpen(true);
  };

  const handleDelete = (subject: any) => {
    setSelectedSubject(subject);
    setDeleteSubjectOpen(true);
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
                <ContextMenu key={subject.id}>
                  <ContextMenuTrigger>
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription className="mt-1">{subject.code}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            <div className={`text-sm font-medium px-2 py-1 rounded-md mr-2 ${
                              percentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {percentage}% Attendance
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-2">
                                <div className="grid gap-1">
                                  <Button 
                                    variant="ghost" 
                                    className="justify-start flex items-center gap-2" 
                                    onClick={() => handleEdit(subject)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit Subject
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    className="justify-start flex items-center gap-2 text-destructive" 
                                    onClick={() => handleDelete(subject)}
                                  >
                                    <Trash className="h-4 w-4" />
                                    Delete Subject
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
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
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => handleViewDetails(subject.id)}>
                      View Details
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleEdit(subject)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleDelete(subject)} className="text-destructive">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })
          )}
        </div>
      )}

      <AddSubjectDialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen} />
      <EditSubjectDialog 
        open={editSubjectOpen} 
        onOpenChange={setEditSubjectOpen} 
        subject={selectedSubject} 
      />
      <DeleteSubjectDialog 
        open={deleteSubjectOpen} 
        onOpenChange={setDeleteSubjectOpen} 
        subject={selectedSubject} 
      />
    </div>
  );
};

export default Subjects;
