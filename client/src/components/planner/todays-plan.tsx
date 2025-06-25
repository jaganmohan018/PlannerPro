import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ActivitySection from "./activity-section";

interface TodaysPlanProps {
  data: any;
  onUpdate: (updates: any) => void;
  selectedDate: string;
}

export default function TodaysPlan({ data, onUpdate, selectedDate }: TodaysPlanProps) {
  const handlePriorityChange = (index: number, value: string) => {
    const priorities = [...(data?.priorities || ["", "", ""])];
    priorities[index] = value;
    onUpdate({ priorities });
  };

  const handleTodoChange = (index: number, field: string, value: any) => {
    const todos = [...(data?.todos || [])];
    todos[index] = { ...todos[index], [field]: value };
    onUpdate({ todos });
  };

  return (
    <>
      {/* Today's Plan Header */}
      <div className="bg-gradient-to-r from-salon-pink to-salon-orange text-white p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Today's Plan</h2>
          <div className="text-right">
            <div className="text-sm opacity-90">DATE</div>
            <div className="text-lg font-bold">{selectedDate}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Contests and Incentives / Upcoming Sales */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-salon-purple mb-3">Contests and Incentives</h4>
            <Textarea
              value={data?.contests || ""}
              onChange={(e) => onUpdate({ contests: e.target.value })}
              className="h-24 resize-none"
              placeholder="Enter contest details..."
            />
          </div>
          <div>
            <h4 className="font-semibold text-salon-purple mb-3">Upcoming Sales</h4>
            <Textarea
              value={data?.upcomingSales || ""}
              onChange={(e) => onUpdate({ upcomingSales: e.target.value })}
              className="h-24 resize-none"
              placeholder="Enter upcoming sales..."
            />
          </div>
        </div>

        <ActivitySection data={data} onUpdate={onUpdate} />

        {/* Today's Priorities and To Do's */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-salon-orange mb-3">TODAY'S PRIORITIES</h4>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-salon-orange font-bold">{index + 1}.</span>
                  <Input
                    value={data?.priorities?.[index] || ""}
                    onChange={(e) => handlePriorityChange(index, e.target.value)}
                    className="flex-1"
                    placeholder={`Priority ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-salon-purple mb-3">TO DO'S</h4>
            <div className="space-y-2">
              {(data?.todos || []).map((todo: any, index: number) => (
                <label key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={todo.completed || false}
                    onCheckedChange={(checked) => handleTodoChange(index, "completed", checked)}
                  />
                  <span className="text-sm">{todo.task}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* End of Day Notes */}
        <div className="bg-salon-orange text-white p-4 rounded-lg">
          <h4 className="font-semibold mb-3">END OF DAY NOTES</h4>
          <Textarea
            value={data?.endOfDayNotes || ""}
            onChange={(e) => onUpdate({ endOfDayNotes: e.target.value })}
            className="bg-white text-black h-24 resize-none"
            placeholder="Record important notes, achievements, challenges, and items for tomorrow..."
          />
        </div>
      </div>
    </>
  );
}
