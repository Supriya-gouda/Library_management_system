import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0,
    overdueBooks: 0,
    monthlyBorrowings: [],
    popularBooks: [],
    activeMembers: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats (using mock data for now)
      // const statsResponse = await adminAPI.getStats();
      
      // Mock data for demonstration (replace with real API calls)
      const mockStats = {
        totalBooks: 150,
        totalMembers: 75,
        activeLoans: 45,
        overdueBooks: 8,
        monthlyBorrowings: [
          { month: 'Jan', borrowings: 120 },
          { month: 'Feb', borrowings: 135 },
          { month: 'Mar', borrowings: 98 },
          { month: 'Apr', borrowings: 167 },
          { month: 'May', borrowings: 189 },
          { month: 'Jun', borrowings: 156 }
        ],
        popularBooks: [
          { title: 'The Great Gatsby', borrowings: 25 },
          { title: 'To Kill a Mockingbird', borrowings: 22 },
          { title: '1984', borrowings: 20 },
          { title: 'Pride and Prejudice', borrowings: 18 },
          { title: 'The Catcher in the Rye', borrowings: 15 }
        ],
        activeMembers: [
          { name: 'John Doe', borrowings: 12 },
          { name: 'Jane Smith', borrowings: 10 },
          { name: 'Mike Johnson', borrowings: 8 },
          { name: 'Sarah Wilson', borrowings: 7 },
          { name: 'David Brown', borrowings: 6 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Mock export functionality
    toast.success('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
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
              <h1 className="text-4xl font-bold gradient-text mb-4">Reports & Analytics</h1>
              <p className="text-gray-600">Library performance insights and statistics</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-field"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                onClick={fetchReports}
                className="btn-outline flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportReport}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeLoans}</p>
                <p className="text-xs text-yellow-600">+15% from last month</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</p>
                <p className="text-xs text-red-600">-5% from last month</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Borrowings Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Monthly Borrowings</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.monthlyBorrowings.map((item, index) => (
                <div key={item.month} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{item.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(item.borrowings / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">{item.borrowings}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Popular Books */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Most Popular Books</h2>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats.popularBooks.map((book, index) => (
                <div key={book.title} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {book.borrowings} loans
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Active Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Most Active Members</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.activeMembers.map((member, index) => (
              <div key={member.name} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-600">{member.borrowings} books</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
