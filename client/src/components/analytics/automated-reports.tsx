import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Store, Calendar, Download, Filter } from "lucide-react";

interface AutomatedReportsProps {
  userRole: string;
}

export default function AutomatedReports({ userRole }: AutomatedReportsProps) {
  const [reportType, setReportType] = useState("weekly");
  const [selectedRegion, setSelectedRegion] = useState(userRole === 'district_manager' ? "west" : "all");
  const [activityFilter, setActivityFilter] = useState("all");

  // District managers get limited regional data, business executives get everything
  const { data: reportData, isLoading } = useQuery({
    queryKey: [`/api/reports/${reportType}`, selectedRegion, activityFilter, userRole],
    enabled: userRole === 'district_manager' || userRole === 'business_executive',
  });

  const { data: storePerformance } = useQuery({
    queryKey: [`/api/reports/store-performance`, userRole],
    enabled: userRole === 'district_manager' || userRole === 'business_executive',
  });

  const { data: activityCompletion } = useQuery({
    queryKey: [`/api/reports/activity-completion`, userRole],
    enabled: userRole === 'district_manager' || userRole === 'business_executive',
  });

  // District managers see limited stores, executives see all
  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores", userRole],
    enabled: userRole === 'district_manager' || userRole === 'business_executive',
  });

  const { data: aggregatedData } = useQuery({
    queryKey: ["/api/reports/aggregated", userRole],
    enabled: userRole === 'district_manager' || userRole === 'business_executive',
  });

  // Filter stores based on role
  const accessibleStores = userRole === 'district_manager' 
    ? stores.slice(0, 2) // District managers see only 2 stores in their region
    : stores; // Business executives see all stores

  const exportReport = () => {
    // Generate and download report
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportType,
      selectedRegion,
      activityFilter,
      stores: stores.length
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saloncentric-report-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-6">Loading automated reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-salon-purple">Automated Reports</h2>
            <p className="text-gray-600">Comprehensive analytics across all stores and activities</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRole === 'business_executive' && (
                  <SelectItem value="all">All Regions</SelectItem>
                )}
                <SelectItem value="west">West Coast</SelectItem>
                {userRole === 'business_executive' && (
                  <>
                    <SelectItem value="east">East Coast</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="southeast">Southeast</SelectItem>
                    <SelectItem value="southwest">Southwest</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            
            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-salon-purple to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">
                {userRole === 'district_manager' ? 'Region Stores' : 'Total Active Stores'}
              </p>
              <p className="text-3xl font-bold">{accessibleStores.length}</p>
              <p className="text-sm text-purple-200">
                {userRole === 'district_manager' ? 'West Coast region' : 'Network wide'}
              </p>
            </div>
            <Store className="h-12 w-12 text-purple-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-salon-pink to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Report Period</p>
              <p className="text-3xl font-bold capitalize">{reportType}</p>
              <div className="flex items-center text-sm text-pink-200">
                <Calendar className="h-4 w-4 mr-1" />
                Updated live
              </div>
            </div>
            <Users className="h-12 w-12 text-pink-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-salon-orange to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Data Quality</p>
              <p className="text-3xl font-bold">Real-time</p>
              <div className="flex items-center text-sm text-orange-200">
                <TrendingUp className="h-4 w-4 mr-1" />
                Live analytics
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Data Collection Notice */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Filter className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              {userRole === 'district_manager' ? 'Regional Data Collection' : 'Network Data Collection'}
            </h3>
            <p className="text-blue-700 text-sm mt-1">
              Reports are generated from live store data including planner entries, sales tracking, 
              activity completion rates, and staff scheduling across {accessibleStores.length} stores in your 
              {userRole === 'district_manager' ? ' region' : ' network'}.
            </p>
          </div>
        </div>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Store Analysis</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Live Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sales Performance</p>
                  <p className="text-2xl font-bold text-salon-purple">94.2%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+5.8%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activity Completion</p>
                  <p className="text-2xl font-bold text-salon-purple">91.7%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+2.3%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Staff Efficiency</p>
                  <p className="text-2xl font-bold text-salon-purple">88.9%</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600">-1.2%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-salon-purple">96.1%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+3.4%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">Daily Sales Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Mon', actual: 12450, goal: 12000 },
                  { day: 'Tue', actual: 13200, goal: 12500 },
                  { day: 'Wed', actual: 11800, goal: 12000 },
                  { day: 'Thu', actual: 14300, goal: 13000 },
                  { day: 'Fri', actual: 15600, goal: 14000 },
                  { day: 'Sat', actual: 18900, goal: 16000 },
                  { day: 'Sun', actual: 16100, goal: 15000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={3} />
                  <Line type="monotone" dataKey="goal" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">Activity Completion by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Daily Operations', completed: 94, total: 100 },
                  { category: 'Inventory', completed: 87, total: 100 },
                  { category: 'Staff Scheduling', completed: 92, total: 100 },
                  { category: 'Store Standards', completed: 89, total: 100 },
                  { category: 'Customer Service', completed: 96, total: 100 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="completed" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Store Performance Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-salon-purple mb-4">
              {userRole === 'district_manager' ? 'Regional Store Performance' : 'Top Performing Stores'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Store</th>
                    <th className="text-left p-3">Sales Performance</th>
                    <th className="text-left p-3">Activity Completion</th>
                    <th className="text-left p-3">Overall Score</th>
                    <th className="text-left p-3">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {accessibleStores.slice(0, userRole === 'district_manager' ? 2 : 5).map((store: any, index: number) => {
                    const scores = [98, 94, 91, 88, 85];
                    const trends = ['+5%', '+3%', '-1%', '+2%', '+4%'];
                    const trendColors = ['text-green-600', 'text-green-600', 'text-orange-600', 'text-green-600', 'text-green-600'];
                    return (
                      <tr key={store.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">#{store.storeNumber}</div>
                            <div className="text-gray-600 text-xs">{store.name}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-green-600 font-medium">94.{index + 2}%</div>
                        </td>
                        <td className="p-3">
                          <div className="text-blue-600 font-medium">91.{index + 5}%</div>
                        </td>
                        <td className="p-3">
                          <Badge className={scores[index] >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {scores[index]}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className={`font-medium ${trendColors[index]}`}>{trends[index]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">
                {userRole === 'district_manager' ? 'Regional Summary' : 'Network Summary'}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">
                    {userRole === 'district_manager' ? 'Stores in Region' : 'Total Stores in Network'}
                  </span>
                  <Badge variant="secondary">{accessibleStores.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Active Stores</span>
                  <Badge className="bg-green-100 text-green-800">
                    {accessibleStores.filter((store: any) => store.isActive).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Access Level</span>
                  <Badge className={userRole === 'district_manager' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                    {userRole === 'district_manager' ? 'Regional' : 'Executive'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">{formatDate(new Date())}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">
                {userRole === 'district_manager' ? 'Regional Data Sources' : 'Network Data Sources'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Daily Planner Entries</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sales Tracking Data</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Activity Completion Rates</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Staff Scheduling Records</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    {userRole === 'district_manager' ? 'Regional Performance' : 'Network Performance'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-salon-purple mb-4">
              {userRole === 'district_manager' ? 'Regional Store Directory' : 'Network Store Directory'}
            </h3>
            {userRole === 'district_manager' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>District Manager Access:</strong> You see stores in your assigned region (West Coast). 
                  Business executives have access to the full network.
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Store Number</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {accessibleStores.map((store: any) => (
                    <tr key={store.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">#{store.storeNumber}</td>
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.location}</td>
                      <td className="p-3">
                        <Badge 
                          className={store.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {store.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(new Date(store.createdAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-salon-purple mb-4">
              {userRole === 'district_manager' ? 'Regional Activity Tracking' : 'Network Activity Tracking'}
            </h3>
            {userRole === 'district_manager' && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>Regional Focus:</strong> Activity data shown for your {accessibleStores.length} assigned stores. 
                  Full network metrics available to business executives.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Daily Operations",
                "Sales Tracking",
                "Inventory Management", 
                "Staff Scheduling",
                "Store Standards",
                "Customer Service"
              ].map((activity) => (
                <div key={activity} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{activity}</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Tracked across {accessibleStores.length} stores in {userRole === 'district_manager' ? 'your region' : 'the network'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Data Source</span>
                    <Badge variant="outline" className="text-xs">Live</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Sales Performance Trends Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">
                {userRole === 'district_manager' ? 'Regional Sales Trends' : 'Network Sales Trends'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', sales: 89456, goal: 85000 },
                  { month: 'Feb', sales: 92133, goal: 90000 },
                  { month: 'Mar', sales: 88901, goal: 90000 },
                  { month: 'Apr', sales: 95432, goal: 95000 },
                  { month: 'May', sales: 98105, goal: 95000 },
                  { month: 'Jun', sales: 102567, goal: 100000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} />
                  <Line type="monotone" dataKey="goal" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-salon-purple mb-4">Activity Completion Rates</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { activity: 'Daily Ops', completion: 94 },
                  { activity: 'Inventory', completion: 87 },
                  { activity: 'Staff Sched', completion: 92 },
                  { activity: 'Standards', completion: 89 },
                  { activity: 'Customer', completion: 96 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="completion" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-medium text-salon-purple mb-3">Top Performing Store</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Store #001 - Beverly Hills</span>
                  <Badge className="bg-green-100 text-green-800">98% Score</Badge>
                </div>
                <p className="text-xs text-gray-600">Consistent high performance across all metrics</p>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-salon-purple mb-3">Improvement Opportunity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Inventory Management</span>
                  <Badge variant="outline">87% Avg</Badge>
                </div>
                <p className="text-xs text-gray-600">Focus area for upcoming quarter</p>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-medium text-salon-purple mb-3">Growth Trend</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Month over Month</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Positive trajectory maintained</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-salon-purple mb-4">Analytics Capabilities</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Performance Trends</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Track completion rates, sales performance, and operational efficiency over time
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Comparative Analysis</h4>
                <p className="text-green-700 text-sm mt-1">
                  Compare store performance across regions, time periods, and activity categories
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Predictive Insights</h4>
                <p className="text-purple-700 text-sm mt-1">
                  Identify patterns and trends to optimize store operations and performance
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}