import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AutomatedReports from "@/components/analytics/automated-reports";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedStore, setSelectedStore] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  // Redirect store associates to planner
  if (user && user.role === 'store_associate') {
    return <Redirect to="/planner" />;
  }

  // Only allow management roles
  if (user && user.role !== 'district_manager' && user.role !== 'business_executive') {
    return <Redirect to="/auth" />;
  }

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
    enabled: user?.role === 'district_manager' || user?.role === 'business_executive',
  });

  // Mock analytics data - in a real app this would come from API
  const salesData = [
    { date: "Jan", sales: 45000, goal: 50000 },
    { date: "Feb", sales: 52000, goal: 50000 },
    { date: "Mar", sales: 48000, goal: 50000 },
    { date: "Apr", sales: 61000, goal: 55000 },
    { date: "May", sales: 58000, goal: 55000 },
    { date: "Jun", sales: 67000, goal: 60000 },
  ];

  const storeComparison = [
    { store: "Store #001", sales: 89456, performance: 98 },
    { store: "Store #002", sales: 82133, performance: 94 },
    { store: "Store #003", sales: 78901, performance: 91 },
    { store: "Store #004", sales: 75432, performance: 88 },
    { store: "Store #005", sales: 72105, performance: 85 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-salon-purple">Store Analytics Dashboard</h1>
      </div>

      {/* Management Analytics Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Automated Reports</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <AutomatedReports userRole={user?.role || ''} />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* Real-time Analytics Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Network Status</h3>
              <div className="text-2xl font-bold text-salon-purple">Live</div>
              <div className="text-sm text-green-600">Real-time data collection</div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Stores</h3>
              <div className="text-2xl font-bold text-salon-purple">{stores.length}</div>
              <div className="text-sm text-blue-600">Connected stores</div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Data Quality</h3>
              <div className="text-2xl font-bold text-salon-purple">High</div>
              <div className="text-sm text-green-600">Authenticated sources</div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-salon-purple mb-4">Store Network Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Store Number</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Data Connection</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store: any) => (
                    <tr key={store.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">#{store.storeNumber}</td>
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.location}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          store.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Connected
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
