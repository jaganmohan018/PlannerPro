export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function hasRole(user: any, roles: string[]): boolean {
  return user && roles.includes(user.role);
}

export function canAccessStore(user: any, storeId: number): boolean {
  if (!user) return false;
  
  if (user.role === 'admin') return true;
  if (user.role === 'store_associate') return user.storeId === storeId;
  // District manager access will be checked by server based on assignments
  if (user.role === 'district_manager') return true; 
  
  return false;
}