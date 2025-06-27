import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, insertStoreSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Store, UserPlus, Building2, Settings } from "lucide-react";

const createUserSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const createStoreSchema = insertStoreSchema.omit({ id: true, createdAt: true });

type CreateUserFormData = z.infer<typeof createUserSchema>;
type CreateStoreFormData = z.infer<typeof createStoreSchema>;

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect non-super-admin users
  if (user && user.role !== 'super_admin') {
    return <Redirect to="/" />;
  }

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === 'super_admin',
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
    enabled: user?.role === 'super_admin',
  });

  const { data: districtManagers = [] } = useQuery({
    queryKey: ["/api/admin/district-managers"],
    enabled: user?.role === 'super_admin',
  });

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "store_associate",
      storeId: undefined,
    },
  });

  const createStoreForm = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      storeNumber: "",
      name: "",
      location: "",
      isActive: true,
      districtManagerId: undefined,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserFormData) => {
      const { confirmPassword, ...createData } = userData;
      const res = await apiRequest("POST", "/api/admin/users", createData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      createUserForm.reset();
      toast({
        title: "User created successfully",
        description: "New user account has been created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: async (storeData: CreateStoreFormData) => {
      const res = await apiRequest("POST", "/api/admin/stores", storeData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      createStoreForm.reset();
      toast({
        title: "Store created successfully",
        description: "New store has been registered.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create store",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const assignStoreMutation = useMutation({
    mutationFn: async ({ storeId, districtManagerId }: { storeId: number; districtManagerId: number }) => {
      const res = await apiRequest("PUT", `/api/admin/stores/${storeId}/assign`, { districtManagerId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({
        title: "Store assigned successfully",
        description: "Store has been assigned to district manager.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign store",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCreateUser = (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  const onCreateStore = (data: CreateStoreFormData) => {
    createStoreMutation.mutate(data);
  };

  const handleStoreAssignment = (storeId: number, districtManagerId: string) => {
    if (districtManagerId && districtManagerId !== "unassign") {
      assignStoreMutation.mutate({ 
        storeId, 
        districtManagerId: parseInt(districtManagerId) 
      });
    }
  };

  return (
    <div className="min-h-screen bg-salon-bg">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-white/80">Manage users, stores, and system settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-white text-salon-purple">Super Admin</Badge>
            <span className="text-white">Welcome, {user?.firstName}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="stores">Store Management</TabsTrigger>
            <TabsTrigger value="assignments">Store Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-salon-purple">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-salon-purple" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Stores</p>
                      <p className="text-2xl font-bold text-salon-purple">{stores.length}</p>
                    </div>
                    <Store className="h-8 w-8 text-salon-purple" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">District Managers</p>
                      <p className="text-2xl font-bold text-salon-purple">{districtManagers.length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-salon-purple" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Stores</p>
                      <p className="text-2xl font-bold text-salon-purple">
                        {stores.filter((store: any) => store.isActive).length}
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-salon-purple" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Current system status and quick actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">System Status: Active</h3>
                    <p className="text-green-700 text-sm">All services running normally</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">User Roles Distribution</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div>Store Associates: {users.filter((u: any) => u.role === 'store_associate').length}</div>
                        <div>District Managers: {users.filter((u: any) => u.role === 'district_manager').length}</div>
                        <div>Business Executives: {users.filter((u: any) => u.role === 'business_executive').length}</div>
                        <div>Super Admins: {users.filter((u: any) => u.role === 'super_admin').length}</div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Store Status</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div>Active: {stores.filter((s: any) => s.isActive).length}</div>
                        <div>Inactive: {stores.filter((s: any) => !s.isActive).length}</div>
                        <div>Assigned: {stores.filter((s: any) => s.districtManagerId).length}</div>
                        <div>Unassigned: {stores.filter((s: any) => !s.districtManagerId).length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Create User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create New User
                </CardTitle>
                <CardDescription>Add a new user account to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUserForm.handleSubmit(onCreateUser)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...createUserForm.register("firstName")}
                        placeholder="First name"
                      />
                      {createUserForm.formState.errors.firstName && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...createUserForm.register("lastName")}
                        placeholder="Last name"
                      />
                      {createUserForm.formState.errors.lastName && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...createUserForm.register("username")}
                        placeholder="Username"
                      />
                      {createUserForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...createUserForm.register("email")}
                        placeholder="Email address"
                      />
                      {createUserForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...createUserForm.register("password")}
                        placeholder="Password"
                      />
                      {createUserForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...createUserForm.register("confirmPassword")}
                        placeholder="Confirm password"
                      />
                      {createUserForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{createUserForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select onValueChange={(value) => createUserForm.setValue("role", value)} defaultValue="store_associate">
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="store_associate">Store Associate</SelectItem>
                          <SelectItem value="district_manager">District Manager</SelectItem>
                          <SelectItem value="business_executive">Business Executive</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeId">Store (for Store Associates)</Label>
                      <Select onValueChange={(value) => createUserForm.setValue("storeId", value ? parseInt(value) : undefined)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store: any) => (
                            <SelectItem key={store.id} value={store.id.toString()}>
                              #{store.storeNumber} - {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-salon-purple hover:bg-salon-light-purple"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage existing user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Username</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Store</th>
                        <th className="text-left p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{user.firstName} {user.lastName}</td>
                          <td className="p-3 font-medium">{user.username}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <Badge variant={
                              user.role === 'super_admin' ? 'default' :
                              user.role === 'business_executive' ? 'secondary' :
                              user.role === 'district_manager' ? 'outline' : 'default'
                            }>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {user.storeId ? `Store #${stores.find((s: any) => s.id === user.storeId)?.storeNumber}` : '-'}
                          </td>
                          <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-6">
            {/* Create Store Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Create New Store
                </CardTitle>
                <CardDescription>Register a new store in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createStoreForm.handleSubmit(onCreateStore)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeNumber">Store Number</Label>
                      <Input
                        id="storeNumber"
                        {...createStoreForm.register("storeNumber")}
                        placeholder="001"
                      />
                      {createStoreForm.formState.errors.storeNumber && (
                        <p className="text-sm text-red-500">{createStoreForm.formState.errors.storeNumber.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        {...createStoreForm.register("name")}
                        placeholder="Store name"
                      />
                      {createStoreForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{createStoreForm.formState.errors.name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...createStoreForm.register("location")}
                      placeholder="City, State"
                    />
                    {createStoreForm.formState.errors.location && (
                      <p className="text-sm text-red-500">{createStoreForm.formState.errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="districtManager">Assign District Manager</Label>
                      <Select onValueChange={(value) => createStoreForm.setValue("districtManagerId", value ? parseInt(value) : undefined)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {districtManagers.map((dm: any) => (
                            <SelectItem key={dm.id} value={dm.id.toString()}>
                              {dm.firstName} {dm.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-salon-purple hover:bg-salon-light-purple"
                    disabled={createStoreMutation.isPending}
                  >
                    {createStoreMutation.isPending ? "Creating..." : "Create Store"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Stores List */}
            <Card>
              <CardHeader>
                <CardTitle>All Stores</CardTitle>
                <CardDescription>Manage existing stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Store #</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">District Manager</th>
                        <th className="text-left p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store: any) => (
                        <tr key={store.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">#{store.storeNumber}</td>
                          <td className="p-3">{store.name}</td>
                          <td className="p-3">{store.location}</td>
                          <td className="p-3">
                            <Badge className={store.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {store.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {store.districtManagerId 
                              ? `${districtManagers.find((dm: any) => dm.id === store.districtManagerId)?.firstName} ${districtManagers.find((dm: any) => dm.id === store.districtManagerId)?.lastName}`
                              : "Unassigned"
                            }
                          </td>
                          <td className="p-3">{new Date(store.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Assignments</CardTitle>
                <CardDescription>Assign stores to district managers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.map((store: any) => (
                    <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Store #{store.storeNumber} - {store.name}</h3>
                        <p className="text-sm text-gray-600">{store.location}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Select
                          value={store.districtManagerId?.toString() || ""}
                          onValueChange={(value) => handleStoreAssignment(store.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Assign district manager" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassign">Unassigned</SelectItem>
                            {districtManagers.map((dm: any) => (
                              <SelectItem key={dm.id} value={dm.id.toString()}>
                                {dm.firstName} {dm.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}