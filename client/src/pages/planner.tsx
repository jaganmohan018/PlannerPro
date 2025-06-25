import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentDate, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import SalesTracking from "@/components/planner/sales-tracking";
import StaffScheduling from "@/components/planner/staff-scheduling";
import ActivitySection from "@/components/planner/activity-section";
import TodaysPlan from "@/components/planner/todays-plan";
import AnalyticsDashboard from "@/components/planner/analytics-dashboard";

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedStore] = useState(1); // TODO: Get from context/navigation
  const queryClient = useQueryClient();

  const { data: plannerData, isLoading } = useQuery({
    queryKey: [`/api/planner/${selectedStore}/${selectedDate}`],
  });

  const updatePlannerMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!plannerData?.id) return;
      return await apiRequest("PUT", `/api/planner/${plannerData.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/planner/${selectedStore}/${selectedDate}`],
      });
    },
  });

  const handleUpdatePlanner = (updates: any) => {
    updatePlannerMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Date and Quick Stats */}
      <Card className="p-6 mb-6 no-print">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-lg font-medium w-auto"
            />
            <span className="text-2xl font-bold text-salon-purple">
              {formatDate(selectedDate)}
            </span>
          </div>
          <div className="flex space-x-6 mt-4 lg:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-purple">
                ${plannerData?.dailySales || "0.00"}
              </div>
              <div className="text-sm text-gray-600">Today's Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-pink">
                ${plannerData?.wtdActual || "0.00"}
              </div>
              <div className="text-sm text-gray-600">WTD</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-orange">
                ${plannerData?.mtdActual || "0.00"}
              </div>
              <div className="text-sm text-gray-600">MTD</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Two-Page Planner Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Left Page: Roadmap to Success */}
        <Card className="overflow-hidden">
          {/* Purple Header */}
          <div className="bg-salon-purple text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">SalonCentric</h2>
                <h3 className="text-xl font-semibold">Roadmap to Success</h3>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">GOAL</div>
                <div className="text-lg font-bold">More Customers</div>
                <div className="text-sm opacity-90">Beautiful Place to Shop, Work, Thrive & Belong</div>
              </div>
            </div>
            
            {/* HOW WE MEASURE SUCCESS */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="text-xs">
                <div className="font-semibold">FOR OUR GUESTS</div>
                <div className="text-xs opacity-90">Positive Experience</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold">FOR OUR TEAM</div>
                <div className="text-xs opacity-90">Individual/Team Performance</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold">FOR OUR BUSINESS</div>
                <div className="text-xs opacity-90">Continued Learning & Development</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <SalesTracking
              data={plannerData}
              onUpdate={handleUpdatePlanner}
            />
            
            <StaffScheduling
              schedules={plannerData?.staffSchedules || []}
              plannerEntryId={plannerData?.id}
            />

            {/* Bottom sections with smaller components */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-salon-orange text-white p-3 rounded">
                <h5 className="font-semibold text-sm mb-2">Inventory Benches</h5>
                <textarea
                  className="w-full bg-white text-black p-2 text-xs rounded resize-none"
                  rows={3}
                  value={plannerData?.inventoryBenches || ""}
                  onChange={(e) => handleUpdatePlanner({ inventoryBenches: e.target.value })}
                  placeholder="Track inventory levels..."
                />
              </div>
              
              <div className="bg-salon-pink text-white p-3 rounded">
                <h5 className="font-semibold text-sm mb-2">Social Posts</h5>
                <textarea
                  className="w-full bg-white text-black p-2 text-xs rounded resize-none"
                  rows={3}
                  value={plannerData?.socialPosts || ""}
                  onChange={(e) => handleUpdatePlanner({ socialPosts: e.target.value })}
                  placeholder="Post content..."
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Right Page: Today's Plan */}
        <Card className="overflow-hidden">
          <TodaysPlan
            data={plannerData}
            onUpdate={handleUpdatePlanner}
            selectedDate={selectedDate}
          />
        </Card>
      </div>

      <AnalyticsDashboard storeId={selectedStore} />
    </div>
  );
}
