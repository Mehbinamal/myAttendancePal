
import React, { useState } from "react";
import { useAttendance, Subject } from "@/contexts/AttendanceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, parseISO } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Subjects = () => {
  const { user } = useAuth();
  const { subjects, addSubject, updateSubject, deleteSubject, getAttendanceStats, isLoading } = useAttendance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim(), newSubjectDescription.trim() || undefined);
      setNewSubjectName("");
      setNewSubjectDescription("");
      setIsAddDialogOpen(false);
    } else {
      toast.error("Subject name cannot be empty");
    }
  };

  const handleUpdateSubject = () => {
    if (currentSubject && newSubjectName.trim()) {
      updateSubject(
        currentSubject.id,
        newSubjectName.trim(),
        newSubjectDescription.trim() || undefined
      );
      setNewSubjectName("");
      setNewSubjectDescription("");
      setCurrentSubject(null);
      setIsEditDialogOpen(false);
    } else {
      toast.error("Subject name cannot be empty");
    }
  };

  const handleDeleteSubject = () => {
    if (currentSubject) {
      deleteSubject(currentSubject.id);
      setCurrentSubject(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (subject: Subject) => {
    setCurrentSubject(subject);
    setNewSubjectName(subject.name);
    setNewSubjectDescription(subject.description || "");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Add a new subject to track attendance for.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this subject..."
                  value={newSubjectDescription}
                  onChange={(e) => setNewSubjectDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            <h3 className="text-xl font-medium mb-2">No Subjects Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add your first subject to start tracking attendance.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const stats = getAttendanceStats(subject.id);
            return (
              <Card key={subject.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{subject.name}</CardTitle>
                  {subject.description && (
                    <CardDescription>{subject.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Attendance</span>
                        <span className="font-medium">
                          {stats.percentage}% ({stats.present}/{stats.present + stats.absent})
                        </span>
                      </div>
                      <Progress value={stats.percentage} className="h-2" />
                    </div>
                    <div className="flex space-x-2 text-sm">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                        <span>Present: {stats.present}</span>
                      </div>
                      <div className="flex items-center">
                        <X className="h-4 w-4 mr-1 text-red-500" />
                        <span>Absent: {stats.absent}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created on {format(parseISO(subject.created_at), "PP")}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex space-x-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(subject)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(subject)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Make changes to your subject details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subject Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Mathematics"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add details about this subject..."
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subject? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentSubject && (
            <Alert variant="destructive">
              <AlertDescription>
                Deleting "{currentSubject.name}" will also remove all attendance records associated with this subject.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
