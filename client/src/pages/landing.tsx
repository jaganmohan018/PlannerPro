import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-salon-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-salon-purple mb-4">
            SalonCentric Planner Pro
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Digital planning solution for 670+ SalonCentric beauty stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-salon-purple">Store Associates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access daily planner to track operations, sales, inventory, and store standards for your assigned store.
              </p>
              <div className="text-sm text-salon-orange font-semibold">
                ✓ Daily Operations Tracking
                <br />
                ✓ Sales & NPS Metrics
                <br />
                ✓ Staff Scheduling
                <br />
                ✓ Inventory Management
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-salon-purple">District Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor multiple stores with analytics dashboard and performance insights across your district.
              </p>
              <div className="text-sm text-salon-orange font-semibold">
                ✓ Multi-Store Analytics
                <br />
                ✓ Performance Dashboards
                <br />
                ✓ District Insights
                <br />
                ✓ Trend Analysis
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-salon-purple">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Complete system management including user roles, store creation, and access control.
              </p>
              <div className="text-sm text-salon-orange font-semibold">
                ✓ User Management
                <br />
                ✓ Store Creation
                <br />
                ✓ Role Assignment
                <br />
                ✓ System Overview
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-salon-purple hover:bg-salon-light-purple text-white px-8 py-3 text-lg"
          >
            Sign In to Planner Pro
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            Secure authentication powered by Replit
          </p>
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-salon-purple mb-4">Features Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-salon-orange mb-2">Daily Planning</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Sales tracking with WTD/MTD/YTD metrics</li>
                <li>• Staff scheduling and time management</li>
                <li>• Activity tracking with checkboxes</li>
                <li>• Today's priorities and to-do lists</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-salon-orange mb-2">Business Intelligence</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Real-time performance analytics</li>
                <li>• Multi-store comparison reports</li>
                <li>• Trend analysis and forecasting</li>
                <li>• Best practices recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}