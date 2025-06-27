import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentDate, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Save, History } from "lucide-react";
import SalesTracking from "@/components/planner/sales-tracking";
import StaffScheduling from "@/components/planner/staff-scheduling";
import ActivitySection from "@/components/planner/activity-section";
import TodaysPlan from "@/components/planner/todays-plan";
import PhotoUpload from "@/components/planner/photo-upload";

export default function PlannerPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [showHistory, setShowHistory] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Redirect non-store associates to dashboard
  if (user && user.role !== 'store_associate') {
    return <Redirect to="/dashboard" />;
  }

  // Redirect if store associate has no assigned store
  if (user && user.role === 'store_associate' && !user.storeId) {
    return <Redirect to="/auth" />;
  }

  // Use the user's assigned store
  const selectedStore = user?.storeId;

  const { data: plannerData, isLoading } = useQuery({
    queryKey: [`/api/planner/${selectedStore}/${selectedDate}`],
    enabled: !!selectedStore, // Only run query if user has assigned store
  });

  // Query for historical planner entries (past 7 days)
  const { data: historicalData } = useQuery({
    queryKey: [`/api/planner/${selectedStore}/history`],
    enabled: showHistory && !!selectedStore,
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
      toast({
        title: "Data saved successfully",
        description: "Your planner data has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const savePlannerMutation = useMutation({
    mutationFn: async () => {
      if (!plannerData?.id) return;
      return await apiRequest("POST", `/api/planner/${plannerData.id}/save`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/planner/${selectedStore}/${selectedDate}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/planner/${selectedStore}/history`],
      });
      toast({
        title: "Data saved successfully",
        description: "Your planner data has been saved and is now available in your history.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
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
      {/* Date, Controls and Quick Stats */}
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
            <div className="flex space-x-2">
              <Button
                onClick={() => savePlannerMutation.mutate()}
                disabled={savePlannerMutation.isPending}
                className="bg-salon-purple hover:bg-salon-purple/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {savePlannerMutation.isPending ? "Saving..." : "Save Data"}
              </Button>
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="border-salon-purple text-salon-purple hover:bg-salon-purple hover:text-white"
              >
                <History className="h-4 w-4 mr-2" />
                {showHistory ? "Hide History" : "View Past 7 Days"}
              </Button>
            </div>
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

      {/* Photo Upload Section - Only for Store Associates */}
      <div className="mt-6">
        <PhotoUpload
          plannerEntryId={plannerData?.id || 0}
          photos={plannerData?.photos || []}
          onUpdate={handleUpdatePlanner}
        />
      </div>

      {/* Historical View - Past 7 Days */}
      {showHistory && (
        <Card className="mt-6 no-print">
          <div className="p-6">
            <h3 className="text-xl font-bold text-salon-purple mb-4 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              Past 7 Days History
            </h3>
            {historicalData ? (
              <div className="space-y-4">
                {historicalData.map((entry: any, index: number) => (
                  <Card key={index} className="p-4 border-l-4 border-salon-purple">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-lg">{formatDate(entry.date)}</div>
                        <div className="text-sm text-gray-600">
                          {entry.date === getCurrentDate() ? "Today" : 
                           new Date(entry.date) >= new Date(getCurrentDate()) ? "Future" : 
                           Math.ceil((new Date(getCurrentDate()).getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24)) + " days ago"}
                        </div>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <Badge variant="outline" className="bg-salon-purple/10 text-salon-purple">
                          Sales: ${entry.dailySales || "0.00"}
                        </Badge>
                        <Badge variant="outline" className="bg-salon-pink/10 text-salon-pink">
                          WTD: ${entry.wtdActual || "0.00"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-blue-700 mb-1">Daily Operations</div>
                        <div className="text-gray-600">
                          {Object.values(entry.dailyOperations || {}).filter(Boolean).length}/8 completed
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-yellow-700 mb-1">Inventory</div>
                        <div className="text-gray-600">
                          {Object.values(entry.inventoryManagement || {}).filter(Boolean).length}/4 completed
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-green-700 mb-1">Store Standards</div>
                        <div className="text-gray-600">
                          {Object.values(entry.storeStandards || {}).filter(Boolean).length}/7 completed
                        </div>
                      </div>
                    </div>
                    {entry.priorities && entry.priorities.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="font-medium text-orange-700 mb-1">Today's Priorities</div>
                        <div className="text-sm text-gray-600">
                          {entry.priorities.filter((p: string) => p.trim()).length} priorities set
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Loading historical data...</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
