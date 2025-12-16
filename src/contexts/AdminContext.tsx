import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { DashboardProvider, useDashboard } from './DashboardContext';
import { UserManagementProvider, useUserManagement } from './UserManagementContext';
import { OrderManagementProvider, useOrderManagement, setOrderManagementDependencies } from './OrderManagementContext';
import { AnalyticsProvider, useAnalytics } from './AnalyticsContext';

/**
 * Composite context that aggregates all admin-related contexts for backward compatibility
 * Individual consumers should use specific hooks (useDashboard, useUserManagement, etc.)
 * instead of useAdmin() for better separation of concerns.
 */
interface CompositeAdminContextType {
  // Dashboard Stats
  dashboardStats: any;
  fetchDashboardStats: () => Promise<void>;
  loadingStats: boolean;

  // User Management
  users: any[];
  usersPagination: any;
  fetchUsers: (page?: number, search?: string, role?: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loadingUsers: boolean;

  // Order Management
  orders: any[];
  ordersPagination: any;
  fetchOrders: (page?: number, orderStatus?: string, paymentStatus?: string, search?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, orderStatus: string) => Promise<void>;
  loadingOrders: boolean;

  // Analytics
  revenueStats: any;
  ordersAnalytics: any;
  usersAnalytics: any;
  fetchRevenueStats: (startDate?: string, endDate?: string) => Promise<void>;
  fetchOrdersAnalytics: () => Promise<void>;
  fetchUsersAnalytics: () => Promise<void>;
}

const AdminContext = createContext<CompositeAdminContextType | undefined>(undefined);

/**
 * Composite Admin Provider that wraps all individual context providers
 * Provides a unified API for backward compatibility while maintaining separation of concerns
 */
const CompositeAdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Check admin role on mount
  useEffect(() => {
    if (user && user.role !== 'admin') {
      logout();
      navigate('/login', { replace: true });
    }
  }, [user, logout, navigate]);

  // Get values from individual context providers
  const dashboardContext = useDashboard();
  const userManagementContext = useUserManagement();
  const orderManagementContext = useOrderManagement();
  const analyticsContext = useAnalytics();

  // Set up dependencies for OrderManagement to avoid circular imports
  useMemo(() => {
    setOrderManagementDependencies({
      dashboardRefresh: dashboardContext.fetchDashboardStats,
      analyticsRefresh: async () => {
        await Promise.all([
          analyticsContext.fetchRevenueStats(),
          analyticsContext.fetchOrdersAnalytics(),
        ]);
      },
    });
  }, [dashboardContext, analyticsContext]);

  const compositeValue: CompositeAdminContextType = {
    // Dashboard
    dashboardStats: dashboardContext.dashboardStats,
    fetchDashboardStats: dashboardContext.fetchDashboardStats,
    loadingStats: dashboardContext.loadingStats,

    // Users
    users: userManagementContext.users,
    usersPagination: userManagementContext.usersPagination,
    fetchUsers: userManagementContext.fetchUsers,
    deleteUser: userManagementContext.deleteUser,
    loadingUsers: userManagementContext.loadingUsers,

    // Orders
    orders: orderManagementContext.orders,
    ordersPagination: orderManagementContext.ordersPagination,
    fetchOrders: orderManagementContext.fetchOrders,
    updateOrderStatus: orderManagementContext.updateOrderStatus,
    loadingOrders: orderManagementContext.loadingOrders,

    // Analytics
    revenueStats: analyticsContext.revenueStats,
    ordersAnalytics: analyticsContext.ordersAnalytics,
    usersAnalytics: analyticsContext.usersAnalytics,
    fetchRevenueStats: analyticsContext.fetchRevenueStats,
    fetchOrdersAnalytics: analyticsContext.fetchOrdersAnalytics,
    fetchUsersAnalytics: analyticsContext.fetchUsersAnalytics,
  };

  return (
    <AdminContext.Provider value={compositeValue}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Main Admin Provider Component
 * Wraps all individual context providers and the composite provider
 */
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DashboardProvider>
      <AnalyticsProvider>
        <UserManagementProvider>
          <OrderManagementProvider>
            <CompositeAdminProvider>
              {children}
            </CompositeAdminProvider>
          </OrderManagementProvider>
        </UserManagementProvider>
      </AnalyticsProvider>
    </DashboardProvider>
  );
};

/**
 * Hook for accessing composite admin context
 * @deprecated Use individual hooks instead (useDashboard, useUserManagement, etc.)
 * for better separation of concerns
 */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Re-export individual hooks for direct usage
export { useDashboard, DashboardProvider } from './DashboardContext';
export { useUserManagement, UserManagementProvider } from './UserManagementContext';
export { useOrderManagement, OrderManagementProvider } from './OrderManagementContext';
export { useAnalytics, AnalyticsProvider } from './AnalyticsContext';