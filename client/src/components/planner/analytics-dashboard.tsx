import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { formatPercentage, formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, Target, Star } from "lucide-react";

interface AnalyticsDashboardProps {
  storeId: number;
}

export default function AnalyticsDashboard({ storeId }: AnalyticsDashboardProps) {
  const { data: analytics = [] } = useQuery({
    queryKey: [`/api/analytics/${storeId}`],
  });

  // Mock data for top performing stores - in a real app this would come from API
  const topStores = [
    { number: "247", name: "Beverly Hills", sales: 89456 },
    { number: "189", name: "Manhattan", sales: 82133 },
    { number: "034", name: "Miami", sales: 78901 },
  ];

  const bestPractices = [
    "Daily staff huddles increase sales by 15%",
    "Social media engagement drives 22% more foot traffic",
    "Product education sessions boost average transaction by $12",
    "Consistent visual merchandising improves conversion by 8%",
  ];

  return (
    <>
      {/* Analytics Dashboard */}
      <Card className="p-6 mb-6 no-print">
        <h3 className="text-xl font-bold text-salon-purple mb-6">Store Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sales Trends */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h4 className="font-semibold text-blue-700">Sales Trends</h4>
            </div>
            <div className="text-2xl font-bold text-blue-800">+12.5%</div>
            <div className="text-sm text-blue-600">vs. last month</div>
            <div className="mt-2 text-xs text-blue-700">Highest performing categories: Color, Styling Tools</div>
          </div>
          
          {/* Staff Performance */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-green-700" />
              <h4 className="font-semibold text-green-700">Staff Performance</h4>
            </div>
            <div className="text-2xl font-bold text-green-800">94%</div>
            <div className="text-sm text-green-600">Activity completion rate</div>
            <div className="mt-2 text-xs text-green-700">Top performer: Kristmann (98% completion)</div>
          </div>
          
          {/* Goal Progress */}
          <div className="bg-gradient-to-br from-salon-pink/20 to-salon-orange/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-salon-purple" />
              <h4 className="font-semibold text-salon-purple">Monthly Goal Progress</h4>
            </div>
            <div className="text-2xl font-bold text-salon-purple">78%</div>
            <div className="text-sm text-salon-pink">of monthly target</div>
            <div className="mt-2 text-xs text-salon-purple">On track to exceed goal by 5%</div>
          </div>
        </div>
      </Card>

      {/* Multi-Store Insights */}
      <Card className="p-6 no-print">
        <h3 className="text-xl font-bold text-salon-purple mb-6">Multi-Store Insights (670+ Locations)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Stores */}
          <div>
            <h4 className="font-semibold text-salon-purple mb-4">Top Performing Stores</h4>
            <div className="space-y-3">
              {topStores.map((store, index) => (
                <div key={store.number} className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Store #{store.number} - {store.name}</span>
                  </div>
                  <span className="text-green-700 font-bold">{formatCurrency(store.sales)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Best Practices */}
          <div>
            <h4 className="font-semibold text-salon-purple mb-4">Best Practices from Top Stores</h4>
            <div className="space-y-2">
              {bestPractices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
