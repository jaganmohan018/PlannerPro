import { useState } from "react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface StaffSchedulingProps {
  schedules: any[];
  plannerEntryId: number;
}

export default function StaffScheduling({ schedules, plannerEntryId }: StaffSchedulingProps) {
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const queryClient = useQueryClient();

  const createScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/staff-schedules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/planner`] });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/staff-schedules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/planner`] });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/staff-schedules/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/planner`] });
    },
  });

  const handleAddStaff = () => {
    const newSchedule = {
      plannerEntryId,
      staffName: "",
      slot8to9: "Open",
      slot9to12: "Open",
      slot12to4: "Open",
      slot4to8: "Open",
    };
    
    createScheduleMutation.mutate(newSchedule);
  };

  const handleUpdateSchedule = (scheduleId: number, field: string, value: string) => {
    updateScheduleMutation.mutate({
      id: scheduleId,
      data: { [field]: value },
    });
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    deleteScheduleMutation.mutate(scheduleId);
  };

  return (
    <div className="mt-4">
      {/* Staff Scheduling Grid - Exact Match to Physical Planner */}
      <div className="grid grid-cols-5 gap-px text-xs">
        {/* Header Row */}
        <div className="bg-blue-200 p-1 text-center font-bold">Name</div>
        <div className="bg-blue-200 p-1 text-center font-bold">8-3pm</div>
        <div className="bg-blue-200 p-1 text-center font-bold">1pm-9p</div>
        <div className="bg-blue-200 p-1 text-center font-bold">Lunch</div>
        <div className="bg-blue-200 p-1 text-center font-bold">1 Break</div>
        
        {/* Sample Staff Rows from Physical Planner */}
        <Input className="text-xs h-6 text-center border-0" placeholder="Kristyman" />
        <Input className="text-xs h-6 text-center border-0" placeholder="8-3pm" />
        <Input className="text-xs h-6 text-center border-0" placeholder="lunch" />
        <Input className="text-xs h-6 text-center border-0" placeholder="Lunch" />
        <Input className="text-xs h-6 text-center border-0" placeholder="1 Break" />
        
        <Input className="text-xs h-6 text-center border-0" placeholder="Jackie" />
        <Input className="text-xs h-6 text-center border-0" placeholder="1pm-9p" />
        <Input className="text-xs h-6 text-center border-0" placeholder="Lunch" />
        <Input className="text-xs h-6 text-center border-0" placeholder="break" />
        <Input className="text-xs h-6 text-center border-0" placeholder="1 break" />
        
        <Input className="text-xs h-6 text-center border-0" placeholder="Shel" />
        <Input className="text-xs h-6 text-center border-0" placeholder="10-6:30" />
        <Input className="text-xs h-6 text-center border-0" placeholder="Lunch" />
        <Input className="text-xs h-6 text-center border-0" placeholder="break" />
        <Input className="text-xs h-6 text-center border-0" placeholder="1 break" />
        
        {/* Additional dynamic rows for existing schedules */}
        {schedules.map((schedule: any) => (
          <React.Fragment key={schedule.id}>
            <Input
              value={schedule.staffName}
              onChange={(e) => handleUpdateSchedule(schedule.id, "staffName", e.target.value)}
              className="text-xs h-6 text-center border-0"
              placeholder="Staff Name"
            />
            <Input
              value={schedule.slot8to9}
              onChange={(e) => handleUpdateSchedule(schedule.id, "slot8to9", e.target.value)}
              className="text-xs h-6 text-center border-0"
              placeholder="Shift"
            />
            <Input
              value={schedule.slot9to12}
              onChange={(e) => handleUpdateSchedule(schedule.id, "slot9to12", e.target.value)}
              className="text-xs h-6 text-center border-0"
              placeholder="Lunch"
            />
            <Input
              value={schedule.slot12to4}
              onChange={(e) => handleUpdateSchedule(schedule.id, "slot12to4", e.target.value)}
              className="text-xs h-6 text-center border-0"
              placeholder="Break"
            />
            <Input
              value={schedule.slot4to8}
              onChange={(e) => handleUpdateSchedule(schedule.id, "slot4to8", e.target.value)}
              className="text-xs h-6 text-center border-0"
              placeholder="Break"
            />
          </React.Fragment>
        ))}
      </div>
      
      <Button
        onClick={handleAddStaff}
        size="sm"
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-xs h-6"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add Staff
      </Button>
    </div>
  );
}
