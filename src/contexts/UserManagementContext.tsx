// src/contexts/UserManagementContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { createAuthErrorHandler } from './utils/authErrorHandler';
import { useDashboard } from './DashboardContext';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  business_name?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers?: number;
  totalOrders?: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UserManagementContextType {
  users: User[];
  usersPagination: Pagination | null;
  fetchUsers: (page?: number, search?: string, role?: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loadingUsers: boolean;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useApi();
  const navigate = useNavigate();
  const { logout } = useUser();
  const { fetchDashboardStats } = useDashboard();

  const [users, setUsers] = useState<User[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleAuthError = createAuthErrorHandler(navigate, logout);

  const fetchUsers = async (page: number = 1, search?: string, role?: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      const response = await api.get(`/users/all?${params.toString()}`);
      setUsers(response.data?.users || []);
      setUsersPagination(response.data?.pagination || null);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      setUsers([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.del(`/users/${userId}`);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      // Refresh critical data concurrently
      await Promise.all([
        fetchUsers(usersPagination?.currentPage || 1),
        fetchDashboardStats(),
      ]);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  return (
    <UserManagementContext.Provider
      value={{
        users,
        usersPagination,
        fetchUsers,
        deleteUser,
        loadingUsers,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};
