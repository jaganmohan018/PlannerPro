import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Navigation from "@/components/layout/navigation";
import PlannerPage from "@/pages/planner";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/planner" component={PlannerPage} allowedRoles={['store_associate']} />
      <ProtectedRoute path="/dashboard" component={Dashboard} allowedRoles={['district_manager', 'business_executive']} />
      <ProtectedRoute path="/admin" component={AdminPage} allowedRoles={['super_admin']} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Home page component that redirects based on user role
function HomePage() {
  return <RoleBasedRedirect />;
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  // Store associates go to planner
  if (user.role === 'store_associate') {
    return <Redirect to="/planner" />;
  }
  
  // Management roles go to analytics dashboard
  if (user.role === 'district_manager' || user.role === 'business_executive') {
    return <Redirect to="/dashboard" />;
  }
  
  // Super admin goes to admin panel
  if (user.role === 'super_admin') {
    return <Redirect to="/admin" />;
  }
  
  return <Redirect to="/auth" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-salon-bg">
            <Navigation />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
