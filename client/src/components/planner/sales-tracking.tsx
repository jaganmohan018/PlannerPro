import { Input } from "@/components/ui/input";

interface SalesTrackingProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export default function SalesTracking({ data, onUpdate }: SalesTrackingProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="mb-4">
      {/* Exact Header Row from Physical Planner */}
      <div className="grid grid-cols-8 gap-px text-xs font-bold">
        <div className="bg-purple-700 text-white p-1 text-center">Daily Sales</div>
        <div className="bg-blue-500 text-white p-1 text-center">WTD Actual</div>
        <div className="bg-blue-600 text-white p-1 text-center">MTD Actual</div>
        <div className="bg-blue-700 text-white p-1 text-center">YTD Actual</div>
        <div className="bg-green-500 text-white p-1 text-center">AIF Service Goal</div>
        <div className="bg-red-500 text-white p-1 text-center">ADT Avg Transaction</div>
        <div className="bg-purple-600 text-white p-1 text-center">NPS Score</div>
        <div className="bg-gray-600 text-white p-1 text-center">Score</div>
      </div>
      
      {/* Time Period Headers */}
      <div className="grid grid-cols-8 gap-px text-xs">
        <div className="bg-gray-100 p-1 text-center font-semibold">$</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">Sales/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">Sales/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">Sales/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">AIF/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">Actual/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">NPS/Goal</div>
        <div className="bg-gray-100 p-1 text-center font-semibold">Score/Goal</div>
      </div>
      
      {/* Data Input Row */}
      <div className="grid grid-cols-8 gap-px">
        <Input
          type="text"
          value={data?.dailySales || ""}
          onChange={(e) => handleChange("dailySales", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="7,934"
        />
        <Input
          type="text"
          value={data?.wtdActual || ""}
          onChange={(e) => handleChange("wtdActual", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="14,917"
        />
        <Input
          type="text"
          value={data?.mtdActual || ""}
          onChange={(e) => handleChange("mtdActual", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="49,507"
        />
        <Input
          type="text"
          value={data?.ytdActual || ""}
          onChange={(e) => handleChange("ytdActual", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="55,641"
        />
        <Input
          type="text"
          value={data?.aifServiceGoal || ""}
          onChange={(e) => handleChange("aifServiceGoal", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="75.04"
        />
        <Input
          type="text"
          value={data?.adtAvgTransaction || ""}
          onChange={(e) => handleChange("adtAvgTransaction", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="$25.64"
        />
        <Input
          type="text"
          value={data?.npsScore || ""}
          onChange={(e) => handleChange("npsScore", e.target.value)}
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="89"
        />
        <Input
          type="text"
          className="text-center text-xs h-8 border-0 rounded-none"
          placeholder="Score"
        />
      </div>

      {/* Time Period Labels */}
      <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
        <div className="bg-red-100 p-1 text-center">
          <div className="bg-red-400 text-white px-2 py-1 rounded text-xs font-bold">10:00 AM</div>
        </div>
        <div className="bg-yellow-100 p-1 text-center">
          <div className="bg-yellow-400 text-white px-2 py-1 rounded text-xs font-bold">12:00 PM</div>
        </div>
        <div className="bg-blue-100 p-1 text-center">
          <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">2:00 PM</div>
        </div>
        <div className="bg-gray-100 p-1 text-center">
          <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs font-bold">Actual End of Day</div>
        </div>
      </div>

      {/* Goal Row */}
      <div className="grid grid-cols-4 gap-4 text-xs">
        <Input className="text-center text-xs h-6 bg-red-50" placeholder="1,984" />
        <Input className="text-center text-xs h-6 bg-yellow-50" placeholder="2,988" />
        <Input className="text-center text-xs h-6 bg-blue-50" placeholder="4,506" />
        <Input className="text-center text-xs h-6 bg-gray-50" placeholder="5,346" />
      </div>
    </div>
  );
}
