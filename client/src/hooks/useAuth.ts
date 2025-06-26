import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user as any,
    isLoading,
    isAuthenticated: !!user,
    role: (user as any)?.role,
    storeId: (user as any)?.storeId,
  };
}