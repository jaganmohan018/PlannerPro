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
      {/* Today's Plan Header - Exact Match */}
      <div className="bg-gradient-to-r from-pink-400 to-orange-400 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold italic">Today's Plan</h2>
          <div className="text-right">
            <div className="text-xs opacity-90">DATE</div>
            <div className="text-sm font-bold">{selectedDate}</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Contests and Incentives / Upcoming Sales */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="bg-gray-100 p-2 text-xs font-bold">Contests and Incentives</div>
            <Textarea
              value={data?.contests || ""}
              onChange={(e) => onUpdate({ contests: e.target.value })}
              className="h-16 text-xs resize-none border-0"
              placeholder="Enter contest details..."
            />
          </div>
          <div>
            <div className="bg-gray-100 p-2 text-xs font-bold">Upcoming Sales</div>
            <Textarea
              value={data?.upcomingSales || ""}
              onChange={(e) => onUpdate({ upcomingSales: e.target.value })}
              className="h-16 text-xs resize-none border-0"
              placeholder="Enter upcoming sales..."
            />
          </div>
        </div>

        {/* Activity Section - Exact Match */}
        <div className="mb-4">
          <div className="bg-gray-200 p-2 text-xs font-bold">ACTIVITY</div>
          <div className="bg-gray-50 p-2">
            <div className="text-xs font-semibold mb-2">Daily Operations</div>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.reviewHuddleCalendar || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, reviewHuddleCalendar: checked }
                    });
                  }}
                />
                <span>Review Huddle Calendar, Email & Teams</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.reviewLaborDashboards || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, reviewLaborDashboards: checked }
                    });
                  }}
                />
                <span>Review Labor Dashboards & UKG Punches</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.pullProcessOmniOrders || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, pullProcessOmniOrders: checked }
                    });
                  }}
                />
                <span>Pull & Process Omni Orders</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.setupEventEducationDemo || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, setupEventEducationDemo: checked }
                    });
                  }}
                />
                <span>Set up and prepare for any Event / Education Class / Demo</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.reconcileDailyPaperwork || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, reconcileDailyPaperwork: checked }
                    });
                  }}
                />
                <span>Reconcile Daily Paperwork, Check Discount & Return Reports</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.checkEndOfDayNotes || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, checkEndOfDayNotes: checked }
                    });
                  }}
                />
                <span>Check End of day Notes from Yesterday</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.checkEducationDashboard || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, checkEducationDashboard: checked }
                    });
                  }}
                />
                <span>Check Education Dashboard for Upcoming Classes</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox
                  checked={data?.dailyOperations?.strategizePrintCallLists || false}
                  onCheckedChange={(checked) => {
                    const currentSection = data?.dailyOperations || {};
                    onUpdate({ 
                      dailyOperations: { ...currentSection, strategizePrintCallLists: checked }
                    });
                  }}
                />
                <span>Strategize & Print call Lists for Upcoming Sales</span>
              </label>
            </div>
          </div>
          
          <div className="bg-blue-50 p-2 mt-2">
            <div className="text-xs font-semibold mb-2">Inventory</div>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Monitor Tracking Key Items to Drive Enthusiasm & Profit</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Backbar Tracking</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Clean Windows & Doors</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Clean Floors</span>
              </label>
            </div>
          </div>

          <div className="bg-green-50 p-2 mt-2">
            <div className="text-xs font-semibold mb-2">Store Standards</div>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Clean & Beautiful Bathrooms</span>
              </label>
              <label className="flex items-center space-x-1">
                <Checkbox />
                <span>Empty All Trash, Take It Out For the Day</span>
              </label>
            </div>
          </div>
        </div>

        {/* Challenges & Promos / Today's Priorities */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="bg-orange-400 text-white p-1 text-xs font-bold">CHALLENGES & PROMOS</div>
            <div className="space-y-1">
              {[1, 2].map((index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="text-xs font-bold">{index}.</span>
                  <Input
                    value={data?.priorities?.[index-1] || ""}
                    onChange={(e) => handlePriorityChange(index-1, e.target.value)}
                    className="flex-1 text-xs h-6 border-0"
                    placeholder="Challenge"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-orange-400 text-white p-1 text-xs font-bold">TODAY'S PRIORITIES</div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="text-xs">{index}.</span>
                  <Input
                    className="flex-1 text-xs h-6 border-0"
                    placeholder="Priority"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TO DO'S */}
        <div className="mb-4">
          <div className="bg-gray-100 p-1 text-xs font-bold">TO DO'S</div>
          <div className="grid grid-cols-1 gap-1">
            {(data?.todos || []).slice(0, 6).map((todo: any, index: number) => (
              <label key={index} className="flex items-center space-x-1">
                <Checkbox
                  checked={todo.completed || false}
                  onCheckedChange={(checked) => handleTodoChange(index, "completed", checked)}
                />
                <span className="text-xs">{todo.task}</span>
              </label>
            ))}
          </div>
        </div>

        {/* End of Day Notes */}
        <div className="bg-orange-400 text-white p-2">
          <div className="text-xs font-bold mb-1">END OF DAY NOTES</div>
          <Textarea
            value={data?.endOfDayNotes || ""}
            onChange={(e) => onUpdate({ endOfDayNotes: e.target.value })}
            className="bg-white text-black text-xs h-16 resize-none border-0"
            placeholder="Notes..."
          />
        </div>
      </div>
    </>
  );
}
