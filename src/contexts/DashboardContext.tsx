// src/contexts/DashboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { createAuthErrorHandler } from './utils/authErrorHandler';

interface DashboardStats {
  overview: {
    totalOrders: number;
    totalUsers: number;
    totalServices: number;
    totalRevenue: number;
    pendingRevenue: number;
    completedOrders: number;
  };
  ordersByStatus: Array<{ _id: string; count: number }>;
  latestOrders: any[];
  monthlyRevenue: Array<{ _id: number; revenue: number; orders: number }>;
}

interface DashboardContextType {
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
  loadingStats: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useApi();
  const navigate = useNavigate();
  const { logout } = useUser();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleAuthError = createAuthErrorHandler(navigate, logout);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get('/dashboard/stats');
      setDashboardStats(response.data);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardStats,
        fetchDashboardStats,
        loadingStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
