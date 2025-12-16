// src/contexts/AnalyticsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { createAuthErrorHandler } from './utils/authErrorHandler';

interface AnalyticsContextType {
  revenueStats: any;
  ordersAnalytics: any;
  usersAnalytics: any;
  fetchRevenueStats: (startDate?: string, endDate?: string) => Promise<void>;
  fetchOrdersAnalytics: () => Promise<void>;
  fetchUsersAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useApi();
  const navigate = useNavigate();
  const { logout } = useUser();

  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [ordersAnalytics, setOrdersAnalytics] = useState<any>(null);
  const [usersAnalytics, setUsersAnalytics] = useState<any>(null);

  const handleAuthError = createAuthErrorHandler(navigate, logout);

  const fetchRevenueStats = async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const response = await api.get(`/dashboard/revenue?${params.toString()}`);
      setRevenueStats(response.data);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch revenue statistics',
        variant: 'destructive',
      });
    }
  };

  const fetchOrdersAnalytics = async () => {
    try {
      const response = await api.get('/dashboard/orders-analytics');
      setOrdersAnalytics(response.data);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch orders analytics',
        variant: 'destructive',
      });
    }
  };

  const fetchUsersAnalytics = async () => {
    try {
      const response = await api.get('/dashboard/users-analytics');
      setUsersAnalytics(response.data);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch users analytics',
        variant: 'destructive',
      });
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{
        revenueStats,
        ordersAnalytics,
        usersAnalytics,
        fetchRevenueStats,
        fetchOrdersAnalytics,
        fetchUsersAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
