import { Checkbox } from "@/components/ui/checkbox";

interface ActivitySectionProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export default function ActivitySection({ data, onUpdate }: ActivitySectionProps) {
  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    const currentSection = data?.[section] || {};
    const updatedSection = {
      ...currentSection,
      [field]: checked,
    };
    onUpdate({ [section]: updatedSection });
  };

  const dailyOps = data?.dailyOperations || {};
  const inventory = data?.inventoryManagement || {};
  const standards = data?.storeStandards || {};

  return (
    <div className="mb-6">
      <h4 className="font-semibold text-salon-purple mb-4 text-lg">ACTIVITY</h4>
      
      {/* Daily Operations */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h5 className="font-semibold text-salon-purple mb-3">Daily Operations</h5>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.reviewHuddleCalendar || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "reviewHuddleCalendar", checked as boolean)
              }
            />
            <span className="text-sm">Review Huddle Calendar, Email & Teams</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.reviewLaborDashboards || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "reviewLaborDashboards", checked as boolean)
              }
            />
            <span className="text-sm">Review Labor Dashboards & UKG Punches</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.pullProcessOmniOrders || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "pullProcessOmniOrders", checked as boolean)
              }
            />
            <span className="text-sm">Pull & Process Omni Orders</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.setupEventEducationDemo || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "setupEventEducationDemo", checked as boolean)
              }
            />
            <span className="text-sm">Set up and prepare for any Event / Education Class / Demo</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.reconcileDailyPaperwork || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "reconcileDailyPaperwork", checked as boolean)
              }
            />
            <span className="text-sm">Reconcile Daily Paperwork, Check Discount & Return Reports</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.checkEndOfDayNotes || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "checkEndOfDayNotes", checked as boolean)
              }
            />
            <span className="text-sm">Check End of day Notes from Yesterday</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.checkEducationDashboard || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "checkEducationDashboard", checked as boolean)
              }
            />
            <span className="text-sm">Check Education Dashboard for Upcoming Classes</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.strategizePrintCallLists || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "strategizePrintCallLists", checked as boolean)
              }
            />
            <span className="text-sm">Strategize & Print call Lists for Upcoming Sales</span>
          </label>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h5 className="font-semibold text-blue-700 mb-3">Inventory Management</h5>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.reviewStoreReceiving || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "reviewStoreReceiving", checked as boolean)
              }
            />
            <span className="text-sm">Review the Store Receiving Report</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.reviewCycleCounts || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "reviewCycleCounts", checked as boolean)
              }
            />
            <span className="text-sm">Review the Cycle Counts Report</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.reviewNegativeOnHands || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "reviewNegativeOnHands", checked as boolean)
              }
            />
            <span className="text-sm">Review the Negative on Hands Report</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.reviewDamageLog || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "reviewDamageLog", checked as boolean)
              }
            />
            <span className="text-sm">Review the Damage Log & Update Accordingly</span>
          </label>
        </div>
      </div>

      {/* Store Standards */}
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <h5 className="font-semibold text-green-700 mb-3">Store Standards</h5>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.maintainVisualMerchandising || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "maintainVisualMerchandising", checked as boolean)
              }
            />
            <span className="text-sm">Maintain Visual Merchandising & marketing Standards</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.replenishFrontFace || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "replenishFrontFace", checked as boolean)
              }
            />
            <span className="text-sm">Replenish, Fully Front Face the Store, Endcaps, Focus Fixtures & Cash Wrap</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.cleanCountersDemo || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "cleanCountersDemo", checked as boolean)
              }
            />
            <span className="text-sm">Clean Counters, Demo Area, Testers & All Displays</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.cleanWindowsDoors || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "cleanWindowsDoors", checked as boolean)
              }
            />
            <span className="text-sm">Clean Windows & Doors</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.cleanFloors || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "cleanFloors", checked as boolean)
              }
            />
            <span className="text-sm">Clean Floors</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.cleanReplenishBathrooms || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "cleanReplenishBathrooms", checked as boolean)
              }
            />
            <span className="text-sm">Clean & Replenish Bathrooms</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.emptyTrashBins || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "emptyTrashBins", checked as boolean)
              }
            />
            <span className="text-sm">Empty All Trash Bins & Take Out for the Day</span>
          </label>
        </div>
      </div>
    </div>
  );
}
