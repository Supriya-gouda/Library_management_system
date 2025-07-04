import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, TrendingUp, Plus, Eye, BarChart3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI, booksAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrowings: 0,
    overdueBooks: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data from multiple endpoints
      const [booksResponse, membersResponse, overdueResponse] = await Promise.all([
        booksAPI.getAll(),
        adminAPI.getAllMembers(),
        adminAPI.getOverdueBorrowings()
      ]);

      // Calculate stats
      const totalBooks = booksResponse.data.length;
      const totalMembers = membersResponse.data.length;
      const overdueBooks = overdueResponse.data.length;

      // Calculate active borrowings (total copies - available copies)
      const activeBorrowings = booksResponse.data.reduce((total, book) => {
        return total + (book.totalCopies - book.availableCopies);
      }, 0);

      setStats({
        totalBooks,
        totalMembers,
        activeBorrowings,
        overdueBooks,
        recentActivity: overdueResponse.data.slice(0, 5) // Show last 5 activities
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: 'Total Books',
      value: stats.totalBooks.toLocaleString(),
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      change: '+12 this month'
    },
    {
      title: 'Active Members',
      value: stats.totalMembers.toLocaleString(),
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+23 this month'
    },
    {
      title: 'Books Borrowed',
      value: stats.activeBorrowings.toLocaleString(),
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
      change: '+5 today'
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks.toLocaleString(),
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      change: '-3 this week'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Book',
      description: 'Add books to the library catalog',
      icon: Plus,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/books'
    },
    {
      title: 'Manage Members',
      description: 'View and manage library members',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/members'
    },
    {
      title: 'View Borrowings',
      description: 'Monitor borrowing activities',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/borrowings'
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      link: '/admin/reports'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage your library system efficiently</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="btn-outline flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="card card-hover group block"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Overdue Books</h2>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((borrowing, index) => (
                <div key={borrowing.id || index} className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      <span className="font-semibold">{borrowing.member?.fullName || 'Unknown Member'}</span> has overdue book{' '}
                      <span className="font-semibold">"{borrowing.book?.title || 'Unknown Book'}"</span>
                    </p>
                    <p className="text-sm text-red-600">
                      Due: {borrowing.dueDate ? new Date(borrowing.dueDate).toLocaleDateString() : 'Unknown'}
                      {borrowing.fine && ` • Fine: $${borrowing.fine}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No overdue books at the moment</p>
                <p className="text-sm text-gray-400">Great job managing the library!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
