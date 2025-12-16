// src/contexts/OrderManagementContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { createAuthErrorHandler } from './utils/authErrorHandler';

interface Order {
  _id: string;
  userId: any;
  orderNumber: string;
  items: any[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    businessName?: string;
    gstin?: string;
  };
  pricing: {
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    discount: number;
    shipping: number;
    total: number;
  };
  orderStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  estimateDate?: string;
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

interface OrderManagementContextType {
  orders: Order[];
  ordersPagination: Pagination | null;
  fetchOrders: (page?: number, orderStatus?: string, paymentStatus?: string, search?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, orderStatus: string) => Promise<void>;
  loadingOrders: boolean;
  // Callback setters for injected dependencies
  setDashboardRefresh?: (fn: () => Promise<void>) => void;
  setAnalyticsRefresh?: (fn: () => Promise<void>) => void;
}

const OrderManagementContext = createContext<OrderManagementContextType | undefined>(undefined);

// Store for injected dependencies to avoid circular imports
const dependencyStore: {
  dashboardRefresh?: () => Promise<void>;
  analyticsRefresh?: () => Promise<void>;
} = {};

export const setOrderManagementDependencies = (deps: { 
  dashboardRefresh: () => Promise<void>;
  analyticsRefresh: () => Promise<void>;
}) => {
  dependencyStore.dashboardRefresh = deps.dashboardRefresh;
  dependencyStore.analyticsRefresh = deps.analyticsRefresh;
};

export const OrderManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useApi();
  const navigate = useNavigate();
  const { logout } = useUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPagination, setOrdersPagination] = useState<Pagination | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleAuthError = createAuthErrorHandler(navigate, logout);

  const fetchOrders = async (
    page: number = 1,
    orderStatus?: string,
    paymentStatus?: string,
    search?: string
  ) => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (orderStatus && orderStatus !== '') params.append('orderStatus', orderStatus);
      if (paymentStatus && paymentStatus !== '') params.append('paymentStatus', paymentStatus);
      if (search && search !== '') params.append('search', search);
      const response = await api.get(`/orders/all?${params.toString()}`);
      setOrders(response.data?.orders || []);
      setOrdersPagination(response.data?.pagination || null);
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      setOrders([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus });
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      
      // Execute critical refreshes concurrently
      if (dependencyStore.dashboardRefresh) {
        await Promise.all([
          fetchOrders(ordersPagination?.currentPage || 1),
          dependencyStore.dashboardRefresh(),
        ]);
      } else {
        await fetchOrders(ordersPagination?.currentPage || 1);
      }

      // Execute analytics refreshes concurrently without blocking the UI
      if (dependencyStore.analyticsRefresh) {
        dependencyStore.analyticsRefresh().catch(() => {
          // Silent fail for non-critical analytics refresh
        });
      }
    } catch (error: any) {
      if (handleAuthError(error)) {
        return;
      }
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  return (
    <OrderManagementContext.Provider
      value={{
        orders,
        ordersPagination,
        fetchOrders,
        updateOrderStatus,
        loadingOrders,
      }}
    >
      {children}
    </OrderManagementContext.Provider>
  );
};

export const useOrderManagement = () => {
  const context = useContext(OrderManagementContext);
  if (context === undefined) {
    throw new Error('useOrderManagement must be used within an OrderManagementProvider');
  }
  return context;
};
