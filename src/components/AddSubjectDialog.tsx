
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";

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
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
  { id: "sat", label: "Saturday" },
  { id: "sun", label: "Sunday" },
];

export function AddSubjectDialog({ open, onOpenChange }: AddSubjectDialogProps) {
  const { addSubject } = useAttendance();
  const [selectedTab, setSelectedTab] = useState("basic");
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [timeSlots, setTimeSlots] = useState<Record<string, { startTime: string; endTime: string }>>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => {
      const newState = { ...prev, [dayId]: !prev[dayId] };
      
      // Initialize time slots for newly selected days
      if (newState[dayId] && !timeSlots[dayId]) {
        setTimeSlots(prevSlots => ({
          ...prevSlots,
          [dayId]: { startTime: "09:00", endTime: "10:00" }
        }));
      }
      
      return newState;
    });
  };

  const handleTimeChange = (dayId: string, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [dayId]: { 
        ...prev[dayId],
        [field]: value 
      }
    }));
  };

  const formatSchedule = () => {
    const scheduleEntries = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([dayId, _]) => {
        const dayName = daysOfWeek.find(day => day.id === dayId)?.label || '';
        const { startTime, endTime } = timeSlots[dayId] || { startTime: "", endTime: "" };
        return `${dayName} ${startTime} - ${endTime}`;
      });
    
    return scheduleEntries.join('; ');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting subject data:", data);
      const schedule = formatSchedule();
      console.log("Formatted schedule:", schedule);
      
      await addSubject({
        name: data.name,
        code: data.code,
        schedule: schedule,
        description: data.description || "",
      });
      
      console.log("Subject added successfully, resetting form");
      form.reset();
      setSelectedDays({});
      setTimeSlots({});
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
        setSelectedDays({});
        setTimeSlots({});
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
                <div>
                  <h3 className="text-sm font-medium mb-2">Select Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day.id}`} 
                          checked={selectedDays[day.id] || false}
                          onCheckedChange={() => toggleDay(day.id)}
                        />
                        <label
                          htmlFor={`day-${day.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Set Time for Each Day</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedDays)
                      .filter(([_, isSelected]) => isSelected)
                      .map(([dayId, _]) => {
                        const dayName = daysOfWeek.find(day => day.id === dayId)?.label;
                        const timeSlot = timeSlots[dayId] || { startTime: "", endTime: "" };
                        
                        return (
                          <div key={dayId} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <div className="font-medium text-sm">{dayName}</div>
                            <div className="flex items-center">
                              <Input 
                                type="time" 
                                value={timeSlot.startTime}
                                onChange={(e) => handleTimeChange(dayId, 'startTime', e.target.value)}
                                className="w-28"
                              />
                              <span className="mx-2">-</span>
                              <Input 
                                type="time" 
                                value={timeSlot.endTime}
                                onChange={(e) => handleTimeChange(dayId, 'endTime', e.target.value)}
                                className="w-28"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {Object.values(selectedDays).some(selected => selected) ? null : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Select days to set up your schedule
                    </p>
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
                    <Button type="submit">Add Subject</Button>
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
