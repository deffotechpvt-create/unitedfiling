// src/pages/admin/AdminDashboardEnhanced.tsx
/**
 * Enhanced Admin Dashboard using individual context hooks
 * This demonstrates the best practice for using the refactored contexts
 * 
 * Instead of using useAdmin() which provides everything, we use individual hooks
 * for better separation of concerns and performance optimization
 */

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { DataTable } from '@/components/admin/DataTable';
import { useDashboard } from '../../contexts/AdminContext';
import { useUserManagement } from '../../contexts/AdminContext';
import { useOrderManagement } from '../../contexts/AdminContext';
import {
    Users,
    ShoppingCart,
    DollarSign,
    Package,
    Search,
    Trash2,
} from 'lucide-react';

export const AdminDashboardEnhanced: React.FC = () => {
    // Use individual hooks instead of useAdmin() for better separation of concerns
    const { dashboardStats, fetchDashboardStats } = useDashboard();
    const { users, usersPagination, fetchUsers, deleteUser, loadingUsers } = useUserManagement();
    const { orders, ordersPagination, fetchOrders, updateOrderStatus, loadingOrders } = useOrderManagement();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Fetch initial data
    useEffect(() => {
        fetchDashboardStats();
        fetchUsers(1);
        fetchOrders(1);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1, searchTerm || undefined);
        }, 700);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Status filter
    useEffect(() => {
        fetchOrders(1, statusFilter || undefined);
    }, [statusFilter]);

    // Handle delete user
    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        await deleteUser(userId);
    };

    // Handle update order status
    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        await updateOrderStatus(orderId, newStatus);
    };

    // User Table Columns
    const userColumns = [
        {
            key: 'name',
            label: 'Name',
            render: (val: any) => val || 'N/A'
        },
        {
            key: 'email',
            label: 'Email',
            render: (val: any) => val || 'N/A'
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (val: any) => val || 'N/A'
        },
        {
            key: 'role',
            label: 'Role',
            render: (val: string) => (
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105 ${
                        val === 'admin'
                            ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 shadow-sm'
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-sm'
                    }`}
                >
                    {val || 'customer'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (val: string) => val ? new Date(val).toLocaleDateString() : 'N/A',
        },
        {
            key: '_id',
            label: 'Actions',
            render: (_: any, row: any) => (
                <button
                    onClick={() => handleDeleteUser(row._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
                    title="Delete"
                >
                    <Trash2 size={16} className="text-red-600 group-hover:text-red-700 transition-colors" />
                </button>
            ),
        },
    ];

    // Order Table Columns
    const orderColumns = [
        {
            key: '_id',
            label: 'Order ID',
            render: (val: string, row: any) => (
                <span className="font-mono text-sm font-semibold text-gray-700">
                    {row.orderNumber || `#${val.slice(-6)}`}
                </span>
            ),
        },
        {
            key: 'customerInfo',
            label: 'Customer',
            render: (val: any, row: any) => {
                return val?.name || row.userId?.name || 'N/A';
            },
        },
        {
            key: 'pricing',
            label: 'Amount',
            render: (val: any) => {
                const total = val?.total || 0;
                return (
                    <span className="font-semibold text-gray-900">
                        ₹{total.toLocaleString()}
                    </span>
                );
            },
        },
        {
            key: 'orderStatus',
            label: 'Status',
            render: (val: string, row: any) => {
                const currentStatus = val || 'Pending';
                return (
                    <select
                        value={currentStatus}
                        onChange={(e) => handleUpdateOrderStatus(row._id, e.target.value)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-0 cursor-pointer transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-offset-1 ${
                            currentStatus === 'Completed'
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 focus:ring-green-400'
                                : currentStatus === 'Pending'
                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 focus:ring-yellow-400'
                                : currentStatus === 'Cancelled'
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 focus:ring-red-400'
                                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 focus:ring-blue-400'
                        }`}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Under Verification">Under Verification</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                );
            },
        },
        {
            key: 'paymentStatus',
            label: 'Payment',
            render: (val: string) => (
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105 ${
                        val === 'Completed'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-sm'
                            : val === 'Failed'
                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-sm'
                            : val === 'Refunded'
                            ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 shadow-sm'
                            : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-sm'
                    }`}
                >
                    {val || 'Pending'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (val: string) => val ? new Date(val).toLocaleDateString() : 'N/A',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6 space-y-8">
            {/* Overview Section */}
            <section id="overview" className="animate-fadeIn">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="animate-slideInUp" style={{ animationDelay: '0ms' }}>
                        <StatCard
                            title="Total Orders"
                            value={dashboardStats?.overview?.totalOrders || 0}
                            icon={ShoppingCart}
                            color="blue"
                            trend="↑ 12% from last month"
                        />
                    </div>
                    <div className="animate-slideInUp" style={{ animationDelay: '100ms' }}>
                        <StatCard
                            title="Total Users"
                            value={dashboardStats?.overview?.totalUsers || 0}
                            icon={Users}
                            color="green"
                            trend="↑ 8% from last month"
                        />
                    </div>
                    <div className="animate-slideInUp" style={{ animationDelay: '200ms' }}>
                        <StatCard
                            title="Total Revenue"
                            value={`₹${(dashboardStats?.overview?.totalRevenue || 0).toLocaleString()}`}
                            icon={DollarSign}
                            color="purple"
                            trend="↑ 15% from last month"
                        />
                    </div>
                    <div className="animate-slideInUp" style={{ animationDelay: '300ms' }}>
                        <StatCard
                            title="Services Ordered"
                            value={dashboardStats?.overview?.totalServices || 0}
                            icon={Package}
                            color="orange"
                            trend="↑ 20% from last month"
                        />
                    </div>
                </div>
            </section>

            {/* Users Management Section */}
            <section id="users" className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                        <span className="text-sm text-gray-600">
                            Showing {users?.length || 0} users
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        data={users || []}
                        columns={userColumns}
                        loading={loadingUsers}
                    />
                </div>
            </section>

            {/* Orders Management Section */}
            <section id="orders" className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
                        <span className="text-sm text-gray-600">
                            Showing {orders?.length || 0} orders
                        </span>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Under Verification">Under Verification</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        data={orders || []}
                        columns={orderColumns}
                        loading={loadingOrders}
                    />
                </div>
            </section>
        </div>
    );
};
