import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAttendance } from "@/contexts/AttendanceContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  name: z.string().min(2, { message: "Subject name must be at least 2 characters." }),
  code: z.string().min(2, { message: "Subject code must be at least 2 characters." }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Days of the week
const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export function AddSubjectDialog({ open, onOpenChange }: AddSubjectDialogProps) {
  const { addSubject, checkScheduleConflict } = useAttendance();
  const [selectedTab, setSelectedTab] = useState("basic");
  const [scheduleItems, setScheduleItems] = useState<Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const [selectedDay, setSelectedDay] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");

  const addTimeSlot = () => {
    if (!selectedDay) {
      toast.error("Please select a day first");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Start and end time are required");
      return;
    }

    // Check if this day already has this exact time slot
    const exists = scheduleItems.some(
      item => item.day === selectedDay && 
             item.startTime === startTime && 
             item.endTime === endTime
    );

    if (exists) {
      toast.error("This time slot already exists for the selected day");
      return;
    }

    setScheduleItems([
      ...scheduleItems,
      {
        day: selectedDay,
        startTime,
        endTime
      }
    ]);

    // Reset input fields but keep the day selected for convenience
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const removeTimeSlot = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  const formatSchedule = () => {
    return scheduleItems.map(item => 
      `${item.day} ${item.startTime} - ${item.endTime}`
    ).join('; ');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting subject data:", data);
      const schedule = formatSchedule();
      console.log("Formatted schedule:", schedule);
      
      // Check for schedule conflicts
      const { hasConflict, conflictingSubject, day, time } = checkScheduleConflict(schedule);
      if (hasConflict) {
        toast.error(`Schedule conflict detected! This time slot overlaps with ${conflictingSubject} on ${day} at ${time}`);
        return;
      }
      
      await addSubject({
        name: data.name,
        code: data.code,
        schedule: schedule,
        description: data.description || "",
      });
      
      console.log("Subject added successfully, resetting form");
      form.reset();
      setScheduleItems([]);
      setSelectedDay("");
      setStartTime("09:00");
      setEndTime("10:00");
      setSelectedTab("basic");
      onOpenChange(false);
      toast.success("Subject added successfully!");
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      console.log("Dialog open state changing to:", newOpenState);
      if (!newOpenState) {
        form.reset();
        setScheduleItems([]);
        setSelectedDay("");
        setStartTime("09:00");
        setEndTime("10:00");
        setSelectedTab("basic");
      }
      onOpenChange(newOpenState);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject to track attendance.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MATH101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Optional description" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Add Schedule</h3>
                  
                  {/* Day selection */}
                  <div className="space-y-2">
                    <FormLabel>Select Day</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <Badge 
                          key={day.id}
                          variant={selectedDay === day.id ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => setSelectedDay(day.id)}
                        >
                          {day.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time slot selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Start Time</FormLabel>
                      <Input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <FormLabel>End Time</FormLabel>
                      <Input 
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Add button */}
                  <Button 
                    type="button"
                    onClick={addTimeSlot}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Time Slot
                  </Button>
                  
                  {/* Display added schedule items */}
                  {scheduleItems.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Schedule</h3>
                      <ScrollArea className="h-[200px] rounded-md border">
                        <div className="space-y-2 p-3 bg-slate-50">
                          {scheduleItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                              <span className="font-medium">{item.day}</span>
                              <div className="flex items-center gap-2">
                                <span>{item.startTime} - {item.endTime}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeTimeSlot(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {scheduleItems.length === 0 && (
                    <div className="text-sm text-muted-foreground mt-2 text-center py-4 border rounded-md">
                      No schedule items added yet
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <DialogFooter>
                {selectedTab === "schedule" ? (
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setSelectedTab("basic")}
                    >
                      Previous
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={scheduleItems.length === 0}
                    >
                      Add Subject
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      type="button" 
                      onClick={() => setSelectedTab("schedule")}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
