import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-salon-bg flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Left side - Login form only */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-salon-purple">SalonCentric</CardTitle>
            <CardDescription>Digital Store Planner System</CardDescription>
            <div className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-lg">
              <strong>Access Restricted:</strong> Contact your Super Admin for account creation
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...loginForm.register("username")}
                  placeholder="Enter your username"
                />
                {loginForm.formState.errors.username && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                  placeholder="Enter your password"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-salon-purple hover:bg-salon-light-purple"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            {/* Test Accounts Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Test Accounts:</h3>
              <div className="text-xs space-y-1">
                <div><strong>Store Associate:</strong> store_associate / password123</div>
                <div><strong>District Manager:</strong> district_manager / password123</div>
                <div><strong>Business Executive:</strong> business_executive / password123</div>
                <div><strong>Super Admin:</strong> super_admin / password123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right side - Hero section */}
        <div className="flex flex-col justify-center space-y-6 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to SalonCentric</h1>
            <p className="text-xl mb-6">Streamline your beauty store operations with our comprehensive digital planner</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-salon-pink rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold">Daily Operations Tracking</h3>
                <p className="text-sm opacity-90">Manage sales, inventory, and staff scheduling</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-salon-orange rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold">Analytics Dashboard</h3>
                <p className="text-sm opacity-90">Real-time insights and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-salon-light-purple rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-semibold">Role-Based Access</h3>
                <p className="text-sm opacity-90">Secure access controls for different user levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}