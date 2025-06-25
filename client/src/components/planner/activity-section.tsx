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
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.storeOpening || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "storeOpening", checked as boolean)
              }
            />
            <span className="text-sm">Store Opening Checklist</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.tillCount || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "tillCount", checked as boolean)
              }
            />
            <span className="text-sm">Till Count & Reconciliation</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.staffMeeting || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "staffMeeting", checked as boolean)
              }
            />
            <span className="text-sm">Staff Meeting/Huddle</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.customerService || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "customerService", checked as boolean)
              }
            />
            <span className="text-sm">Customer Service Review</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.displayMaintenance || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "displayMaintenance", checked as boolean)
              }
            />
            <span className="text-sm">Display Maintenance</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={dailyOps.safetyCheck || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("dailyOperations", "safetyCheck", checked as boolean)
              }
            />
            <span className="text-sm">Safety Check</span>
          </label>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h5 className="font-semibold text-blue-700 mb-3">Inventory Management</h5>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.stockLevelReview || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "stockLevelReview", checked as boolean)
              }
            />
            <span className="text-sm">Stock Level Review</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.reorderProcessing || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "reorderProcessing", checked as boolean)
              }
            />
            <span className="text-sm">Reorder Processing</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.newArrivals || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "newArrivals", checked as boolean)
              }
            />
            <span className="text-sm">New Arrivals Processing</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={inventory.expiryMonitoring || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange("inventoryManagement", "expiryMonitoring", checked as boolean)
              }
            />
            <span className="text-sm">Expiry Date Monitoring</span>
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
