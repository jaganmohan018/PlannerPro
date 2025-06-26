import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { hasRole } from "@/lib/authUtils";
import Navigation from "@/components/layout/navigation";
import PlannerPage from "@/pages/planner";
import Dashboard from "@/pages/dashboard";
import AdminPage from "@/pages/admin";
import Landing from "@/pages/landing";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-salon-bg flex items-center justify-center">
        <div className="text-salon-purple text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={PlannerPage} />
        <Route path="/planner" component={PlannerPage} />
        <Route path="/dashboard" component={Dashboard} />
        {hasRole(user, ['admin']) && (
          <Route path="/admin" component={AdminPage} />
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-salon-bg">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
