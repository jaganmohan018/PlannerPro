import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Scissors, ChartLine, FileText, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();
  const [selectedStore, setSelectedStore] = useState<string>("1");

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
  });

  const handlePrint = () => {
    window.print();
  };

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
                  Planner
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button
                  variant={location === "/dashboard" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-white hover:bg-salon-light-purple",
                    location === "/dashboard" && "bg-white text-salon-purple hover:bg-gray-100"
                  )}
                >
                  <ChartLine className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48 bg-salon-light-purple text-white border-none">
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store: any) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    Store #{store.storeNumber} - {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-white text-salon-purple hover:bg-gray-100"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
