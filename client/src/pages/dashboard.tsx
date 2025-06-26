import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

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
        <h1 className="text-3xl font-bold text-salon-purple">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store: any) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  Store #{store.storeNumber} - {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
          <div className="text-2xl font-bold text-salon-purple">{formatCurrency(1247892)}</div>
          <div className="text-sm text-green-600">↗ +15.3% vs last month</div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Stores</h3>
          <div className="text-2xl font-bold text-salon-purple">672</div>
          <div className="text-sm text-blue-600">+3 new this month</div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Performance</h3>
          <div className="text-2xl font-bold text-salon-purple">92%</div>
          <div className="text-sm text-green-600">↗ +2.1% completion rate</div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Goal Achievement</h3>
          <div className="text-2xl font-bold text-salon-purple">87%</div>
          <div className="text-sm text-salon-orange">584 stores on track</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales vs Goals Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-salon-purple mb-4">Sales vs Goals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="sales" fill="var(--salon-purple)" />
              <Bar dataKey="goal" fill="var(--salon-pink)" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-salon-purple mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="sales" stroke="var(--salon-purple)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Store Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-salon-purple mb-4">Top Performing Stores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Store</th>
                <th className="text-right p-2">Sales</th>
                <th className="text-right p-2">Performance</th>
                <th className="text-right p-2">Goal Achievement</th>
                <th className="text-right p-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {storeComparison.map((store, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{store.store}</td>
                  <td className="p-2 text-right">{formatCurrency(store.sales)}</td>
                  <td className="p-2 text-right">{formatPercentage(store.performance)}</td>
                  <td className="p-2 text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      On Track
                    </span>
                  </td>
                  <td className="p-2 text-right text-green-600">↗ +{Math.floor(Math.random() * 10) + 5}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
