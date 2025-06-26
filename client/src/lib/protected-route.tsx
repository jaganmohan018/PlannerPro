import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

function ProtectedContent({ 
  component: Component, 
  allowedRoles, 
  path 
}: { 
  component: () => React.JSX.Element;
  allowedRoles?: string[];
  path: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-salon-bg">
        <Loader2 className="h-8 w-8 animate-spin text-salon-purple" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on user role
    if (user.role === 'store_associate') {
      return <Redirect to="/planner" />;
    } else if (user.role === 'district_manager' || user.role === 'business_executive') {
      return <Redirect to="/dashboard" />;
    }
    return <Redirect to="/auth" />;
  }

  return <Component />;
}

export function ProtectedRoute({
  path,
  component,
  allowedRoles,
}: {
  path: string;
  component: () => React.JSX.Element;
  allowedRoles?: string[];
}) {
  return (
    <Route path={path}>
      <ProtectedContent component={component} allowedRoles={allowedRoles} path={path} />
    </Route>
  );
}