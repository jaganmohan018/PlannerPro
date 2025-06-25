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

      {/* Two-Page Planner Layout - Exact Match to Physical Planner */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Left Page: Roadmap to Success */}
        <Card className="overflow-hidden bg-white shadow-xl">
          {/* Purple Header with Exact Layout */}
          <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-xs opacity-90 mb-1">SalonCentric</div>
                <h2 className="text-xl font-bold italic mb-1">Roadmap</h2>
                <h2 className="text-xl font-bold italic">to Success</h2>
              </div>
              <div className="text-center px-4">
                <div className="text-xs font-bold mb-1">GOAL</div>
                <div className="text-sm font-bold leading-tight">Inspire the</div>
                <div className="text-sm font-bold leading-tight">Beauty Community</div>
                <div className="text-sm font-bold leading-tight">to be</div>
                <div className="text-sm font-bold leading-tight">More Colorful</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold mb-1">BE THE</div>
                <div className="text-sm font-bold leading-tight">Beautiful Place</div>
                <div className="text-sm font-bold leading-tight">to Shop, Work,</div>
                <div className="text-sm font-bold leading-tight">Thrive & Belong</div>
              </div>
            </div>
            
            {/* HOW WE MEASURE SUCCESS */}
            <div className="mt-4 border-t border-purple-600 pt-3">
              <div className="text-xs font-bold text-center mb-2">HOW WE MEASURE SUCCESS</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold">FOR OUR GUESTS</div>
                  <div className="text-xs opacity-90">Positive Experience</div>
                  <div className="text-xs opacity-90">Appointment Kept %</div>
                  <div className="text-xs opacity-90">Positive NPS</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">FOR OUR TEAMS</div>
                  <div className="text-xs opacity-90">Individual/Team Performance</div>
                  <div className="text-xs opacity-90">Internal NPS</div>
                  <div className="text-xs opacity-90">Continued Learning & Development</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">FOR OUR BUSINESS</div>
                  <div className="text-xs opacity-90">Sales Achievement</div>
                  <div className="text-xs opacity-90">Margin Achievement</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <SalesTracking
              data={plannerData}
              onUpdate={handleUpdatePlanner}
            />
            
            <StaffScheduling
              schedules={plannerData?.staffSchedules || []}
              plannerEntryId={plannerData?.id}
            />

            {/* Orange and Pink Bottom Sections */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-orange-400 text-white p-2 rounded text-xs">
                <div className="font-bold mb-1">Inventory Benches</div>
                <div className="bg-white text-black p-1 rounded text-xs">
                  <div className="text-xs">Today's Reviews, Reports & Staff Assignments</div>
                  <textarea
                    className="w-full border-0 text-xs resize-none h-12"
                    value={plannerData?.inventoryBenches || ""}
                    onChange={(e) => handleUpdatePlanner({ inventoryBenches: e.target.value })}
                    placeholder="Notes..."
                  />
                </div>
              </div>
              
              <div className="bg-orange-400 text-white p-2 rounded text-xs">
                <div className="font-bold mb-1">Upcoming Education</div>
                <div className="bg-white text-black p-1 rounded text-xs">
                  <div className="text-xs">Classes</div>
                  <textarea
                    className="w-full border-0 text-xs resize-none h-12"
                    value={plannerData?.upcomingEducation || ""}
                    onChange={(e) => handleUpdatePlanner({ upcomingEducation: e.target.value })}
                    placeholder="Class details..."
                  />
                </div>
              </div>

              <div className="bg-orange-400 text-white p-2 rounded text-xs">
                <div className="font-bold mb-1">Education To Sold</div>
                <div className="bg-white text-black p-1 rounded text-xs">
                  <div className="text-xs">Date | Class Name | Store #</div>
                  <textarea
                    className="w-full border-0 text-xs resize-none h-12"
                    value={plannerData?.educationToSold || ""}
                    onChange={(e) => handleUpdatePlanner({ educationToSold: e.target.value })}
                    placeholder="Education tracking..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-pink-400 text-white p-2 rounded text-xs mt-2">
              <div className="font-bold mb-1">Social Posts/Community Connection</div>
              <textarea
                className="w-full bg-white text-black p-1 text-xs rounded resize-none h-16"
                value={plannerData?.socialPosts || ""}
                onChange={(e) => handleUpdatePlanner({ socialPosts: e.target.value })}
                placeholder="Social media posts and community engagement..."
              />
            </div>
          </div>
        </Card>

        {/* Right Page: Today's Plan */}
        <Card className="overflow-hidden bg-white shadow-xl">
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
