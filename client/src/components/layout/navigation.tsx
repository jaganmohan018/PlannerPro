import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Scissors, ChartLine, FileText, Printer, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();
  const [selectedStore, setSelectedStore] = useState<string>("1");
  const { user, logoutMutation } = useAuth();

  const { data: stores = [] } = useQuery<any[]>({
    queryKey: ["/api/stores"],
    enabled: !!user, // Only fetch stores if user is authenticated
  });

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Don't show navigation if user is not authenticated
  if (!user) {
    return null;
  }

  // Role-based navigation items
  const isStoreAssociate = user.role === 'store_associate';
  const isManagement = user.role === 'district_manager' || user.role === 'business_executive';
  const isSuperAdmin = user.role === 'super_admin';

  return (
    <nav className="bg-salon-purple text-white shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Scissors className="text-2xl" />
            <h1 className="text-xl font-bold">SalonCentric Digital Planner</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isStoreAssociate && (
                <Link href="/planner">
                  <Button
                    variant={location === "/" || location === "/planner" ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-white hover:bg-salon-light-purple",
                      (location === "/" || location === "/planner") && "bg-white text-salon-purple hover:bg-gray-100"
                    )}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Daily Planner
                  </Button>
                </Link>
              )}
              
              {isManagement && (
                <Link href="/dashboard">
                  <Button
                    variant={location === "/" || location === "/dashboard" ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-white hover:bg-salon-light-purple",
                      (location === "/" || location === "/dashboard") && "bg-white text-salon-purple hover:bg-gray-100"
                    )}
                  >
                    <ChartLine className="w-4 h-4 mr-2" />
                    Store Analytics
                  </Button>
                </Link>
              )}
            </div>

            {isStoreAssociate && (
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-48 bg-salon-light-purple text-white border-none">
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(stores) && stores.map((store: any) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      Store #{store.storeNumber} - {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isManagement && (
              <div className="text-sm text-white">
                <span className="opacity-90">Multi-Store Analytics</span>
              </div>
            )}

            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-white text-salon-purple hover:bg-gray-100"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <span className="opacity-90">{user.firstName} {user.lastName}</span>
                <div className="text-xs opacity-75 capitalize">{user.role.replace('_', ' ')}</div>
              </div>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-salon-light-purple"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
