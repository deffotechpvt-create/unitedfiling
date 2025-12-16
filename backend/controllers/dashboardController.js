// src/controllers/dashboardController.ts (or .js)
const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    // Use Promise.all for parallel execution - Much faster!
    const [
      totalOrders,
      totalUsers,
      uniqueServicesResult,
      revenueData,
      pendingRevenueData,
      completedOrders,
      ordersByStatus,
      latestOrders,
      monthlyRevenue
    ] = await Promise.all([
      // Basic counts with lean()
      Order.countDocuments(),
      User.countDocuments(),
      
      // Count unique services from orders
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.serviceId' } },
        { $count: 'total' }
      ]),
      
      // Total revenue (completed payments only)
      Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      
      // Pending revenue
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: { $in: ['Pending', 'Processing'] }
          } 
        },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      
      // Completed orders count
      Order.countDocuments({ orderStatus: 'Completed' }),
      
      // Orders by status
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Latest orders with user info
      Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber orderStatus paymentStatus pricing.total createdAt')
        .lean(),
      
      // Monthly revenue for current year
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'Completed',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lte: new Date(new Date().getFullYear(), 11, 31, 23, 59, 59)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            revenue: { $sum: '$pricing.total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);
    
    const totalServices = uniqueServicesResult[0]?.total || 0;
    const totalRevenue = revenueData[0]?.total || 0;
    const pendingRevenue = pendingRevenueData[0]?.total || 0;

    // Fill missing months with 0
    const monthlyRevenueComplete = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyRevenue.find(m => m._id === i + 1);
      return {
        month: i + 1,
        revenue: monthData?.revenue || 0,
        orders: monthData?.orders || 0
      };
    });

    res.json({
      success: true,
      overview: {
        totalOrders,
        totalUsers,
        totalServices,
        totalRevenue,
        pendingRevenue,
        completedOrders
      },
      ordersByStatus,
      latestOrders,
      monthlyRevenue: monthlyRevenueComplete,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // ✅ FIX 1: Use 'Completed' payment status (not 'Paid')
    const matchFilter = { paymentStatus: 'Completed' };

    if (startDate && endDate) {
      matchFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // ✅ FIX 2: Use pricing.total (not totalAmount)
    const revenue = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$pricing.total' }
        }
      }
    ]);

    // ✅ FIX 3: Revenue by service - use pricing correctly
    const revenueByService = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.serviceId',
          serviceName: { $first: '$items.title' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      totalOrders: revenue[0]?.totalOrders || 0,
      averageOrderValue: revenue[0]?.averageOrderValue || 0,
      topServices: revenueByService,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revenue stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const getOrdersAnalytics = async (req, res) => {
  try {
    // ✅ FIX 1: Orders by payment status - use pricing.total
    const ordersByPayment = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$pricing.total' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // ✅ FIX 2: Daily orders (last 30 days) - use pricing.total
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ✅ FIX 3: Top customers - use pricing.total
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          totalOrders: 1,
          totalSpent: 1
        }
      }
    ]);

    res.json({
      success: true,
      ordersByPayment,
      dailyOrders,
      topCustomers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Orders analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const getUsersAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const customerCount = await User.countDocuments({ role: 'customer' });

    // ✅ FIX 1: New users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // ✅ FIX 2: Users with orders
    const usersWithOrders = await Order.distinct('userId');

    // ✅ FIX 3: Recent users
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      totalUsers,
      adminCount,
      customerCount,
      newUsers,
      activeUsers: usersWithOrders.length,
      recentUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Users analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getDashboardStats,
  getRevenueStats,
  getOrdersAnalytics,
  getUsersAnalytics
};