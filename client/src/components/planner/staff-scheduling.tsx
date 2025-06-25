import { useState } from "react";
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
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-salon-purple">Staff Scheduling</h4>
        <Button
          onClick={handleAddStaff}
          size="sm"
          className="bg-salon-purple hover:bg-salon-light-purple"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {/* Header */}
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">Name</div>
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">8-9am</div>
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">9-12pm</div>
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">12-4pm</div>
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">4-8pm</div>
        <div className="bg-gray-100 p-2 text-center font-semibold text-sm">Actions</div>
        
        {/* Staff Rows */}
        {schedules.map((schedule: any) => (
          <>
            <Input
              key={`name-${schedule.id}`}
              value={schedule.staffName}
              onChange={(e) => handleUpdateSchedule(schedule.id, "staffName", e.target.value)}
              className="text-sm h-10"
              placeholder="Staff Name"
            />
            <Select
              value={schedule.slot8to9}
              onValueChange={(value) => handleUpdateSchedule(schedule.id, "slot8to9", value)}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={schedule.slot9to12}
              onValueChange={(value) => handleUpdateSchedule(schedule.id, "slot9to12", value)}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={schedule.slot12to4}
              onValueChange={(value) => handleUpdateSchedule(schedule.id, "slot12to4", value)}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={schedule.slot4to8}
              onValueChange={(value) => handleUpdateSchedule(schedule.id, "slot4to8", value)}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleDeleteSchedule(schedule.id)}
              variant="destructive"
              size="sm"
              className="h-10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ))}
      </div>
    </div>
  );
}
