import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("store_associate");
  const [newStoreData, setNewStoreData] = useState({
    storeNumber: "",
    name: "",
    location: "",
  });

  // Fetch users by role
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users", selectedRole],
    queryFn: () => apiRequest(`/api/admin/users?role=${selectedRole}`),
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  // Fetch all stores
  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async (storeData: typeof newStoreData) => {
      return await apiRequest("/api/stores", {
        method: "POST",
        body: JSON.stringify(storeData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store created successfully",
      });
      setNewStoreData({ storeNumber: "", name: "", location: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create store",
        variant: "destructive",
      });
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role, storeId }: { userId: string; role: string; storeId?: number }) => {
      return await apiRequest(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role, storeId }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  // Store assignment mutation
  const addStoreAssignmentMutation = useMutation({
    mutationFn: async ({ userId, storeId }: { userId: string; storeId: number }) => {
      return await apiRequest("/api/admin/store-assignments", {
        method: "POST",
        body: JSON.stringify({ userId, storeId }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store assignment created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create store assignment",
        variant: "destructive",
      });
    },
  });

  const handleCreateStore = () => {
    if (!newStoreData.storeNumber || !newStoreData.name || !newStoreData.location) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    createStoreMutation.mutate(newStoreData);
  };

  const handleUpdateUserRole = (userId: string, role: string, storeId?: number) => {
    updateUserRoleMutation.mutate({ userId, role, storeId });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "district_manager":
        return "bg-blue-100 text-blue-800";
      case "store_associate":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-salon-purple">Admin Dashboard</h1>
        <Button onClick={() => window.location.href = "/api/logout"} variant="outline">
          Logout
        </Button>
      </div>

      {/* Store Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-salon-purple">Store Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Store Number (e.g., 001)"
              value={newStoreData.storeNumber}
              onChange={(e) => setNewStoreData({ ...newStoreData, storeNumber: e.target.value })}
            />
            <Input
              placeholder="Store Name"
              value={newStoreData.name}
              onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={newStoreData.location}
              onChange={(e) => setNewStoreData({ ...newStoreData, location: e.target.value })}
            />
            <Button 
              onClick={handleCreateStore}
              disabled={createStoreMutation.isPending}
              className="bg-salon-purple hover:bg-salon-light-purple"
            >
              Create Store
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Total Stores: {stores.length}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-salon-purple">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="store_associate">Store Associates</SelectItem>
                <SelectItem value="district_manager">District Managers</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {usersLoading ? (
            <div>Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Store</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.storeId ? `Store ${user.storeId}` : "Not assigned"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select 
                          onValueChange={(storeId) => 
                            handleUpdateUserRole(user.id, "store_associate", parseInt(storeId))
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Assign Store" />
                          </SelectTrigger>
                          <SelectContent>
                            {stores.map((store: any) => (
                              <SelectItem key={store.id} value={store.id.toString()}>
                                {store.storeNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          onValueChange={(role) => handleUpdateUserRole(user.id, role)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="store_associate">Store Associate</SelectItem>
                            <SelectItem value="district_manager">District Manager</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-salon-purple">System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-purple">{stores.length}</div>
              <div className="text-sm text-gray-600">Total Stores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-pink">{users.length}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-salon-orange">670+</div>
              <div className="text-sm text-gray-600">Target Stores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}