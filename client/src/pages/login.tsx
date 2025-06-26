import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-salon-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-salon-purple mb-2">
            SalonCentric Planner Pro
          </h1>
          <p className="text-gray-600">Sign in to access your planner</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-salon-purple">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Sign in with your Replit account to access the SalonCentric store management system.
            </p>
            
            <Button
              onClick={handleLogin}
              className="w-full bg-salon-purple hover:bg-salon-light-purple"
            >
              Sign In with Replit
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold text-salon-purple mb-2">Authentication Info</h3>
          <p className="text-sm text-gray-600">
            This application uses Replit OAuth for secure authentication. Your Replit account will be used to create your user profile in the system.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            New users will be assigned the "Store Associate" role by default. Contact your administrator to upgrade permissions.
          </p>
        </div>
      </div>
    </div>
  );
}