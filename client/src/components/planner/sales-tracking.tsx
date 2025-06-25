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
    <div>
      <h4 className="font-semibold text-salon-purple mb-4">Sales Tracking</h4>
      
      {/* Header Row */}
      <div className="grid grid-cols-8 gap-1 text-xs font-semibold mb-2">
        <div className="bg-salon-purple text-white p-2 text-center rounded-sm">Daily Sales</div>
        <div className="bg-blue-500 text-white p-2 text-center rounded-sm">WTD Actual</div>
        <div className="bg-blue-600 text-white p-2 text-center rounded-sm">MTD Actual</div>
        <div className="bg-blue-700 text-white p-2 text-center rounded-sm">YTD Actual</div>
        <div className="bg-green-500 text-white p-2 text-center rounded-sm">AIF Goal</div>
        <div className="bg-red-500 text-white p-2 text-center rounded-sm">ADT Avg</div>
        <div className="bg-purple-500 text-white p-2 text-center rounded-sm">NPS Score</div>
        <div className="bg-gray-500 text-white p-2 text-center rounded-sm">Score</div>
      </div>
      
      {/* Data Row */}
      <div className="grid grid-cols-8 gap-1">
        <Input
          type="number"
          value={data?.dailySales || ""}
          onChange={(e) => handleChange("dailySales", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.wtdActual || ""}
          onChange={(e) => handleChange("wtdActual", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.mtdActual || ""}
          onChange={(e) => handleChange("mtdActual", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.ytdActual || ""}
          onChange={(e) => handleChange("ytdActual", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.aifServiceGoal || ""}
          onChange={(e) => handleChange("aifServiceGoal", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.adtAvgTransaction || ""}
          onChange={(e) => handleChange("adtAvgTransaction", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          value={data?.npsScore || ""}
          onChange={(e) => handleChange("npsScore", e.target.value)}
          className="text-center text-sm h-10"
          placeholder="0"
        />
        <Input
          type="number"
          className="text-center text-sm h-10"
          placeholder="0"
        />
      </div>
    </div>
  );
}
