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
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.visualMerchandising || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "visualMerchandising", checked as boolean)
              }
            />
            <span className="text-sm">Visual Merchandising</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.cleanliness || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "cleanliness", checked as boolean)
              }
            />
            <span className="text-sm">Cleanliness Standards</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.productOrganization || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "productOrganization", checked as boolean)
              }
            />
            <span className="text-sm">Product Organization</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={standards.signageUpdates || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("storeStandards", "signageUpdates", checked as boolean)
              }
            />
            <span className="text-sm">Signage Updates</span>
          </label>
        </div>
      </div>
    </div>
  );
}
