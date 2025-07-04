import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, TrendingUp, User, RotateCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentBorrowings, setCurrentBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningBooks, setReturningBooks] = useState(new Set());

  useEffect(() => {
    fetchCurrentBorrowings();
  }, []);

  const fetchCurrentBorrowings = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCurrentBorrowings();
      setCurrentBorrowings(response.data || []);
    } catch (error) {
      console.error('Error fetching current borrowings:', error);
      // Don't show error toast for data fetching - just log it
      setCurrentBorrowings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    if (returningBooks.has(borrowingId)) {
      return;
    }

    try {
      setReturningBooks(prev => new Set([...prev, borrowingId]));
      const response = await userAPI.returnBook(borrowingId);

      if (response.data.fine && response.data.fine > 0) {
        toast.success(`Book returned successfully! Fine: $${response.data.fine}`);
      } else {
        toast.success('Book returned successfully!');
      }

      fetchCurrentBorrowings();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to return book';
      toast.error(errorMessage);
    } finally {
      setReturningBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(borrowingId);
        return newSet;
      });
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const overdueCount = currentBorrowings.filter(borrowing =>
    calculateDaysOverdue(borrowing.dueDate) > 0
  ).length;

  const stats = [
    {
      title: 'Current Borrowings',
      value: currentBorrowings.length.toString(),
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      change: 'Active books'
    },
    {
      title: 'Overdue Books',
      value: overdueCount.toString(),
      icon: AlertCircle,
      color: overdueCount > 0 ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500',
      change: overdueCount > 0 ? 'Needs attention' : 'All on time'
    },
    {
      title: 'Books Rated',
      value: '8',
      icon: Star,
      color: 'from-green-500 to-emerald-500',
      change: '+3 this month'
    },
    {
      title: 'Reading Streak',
      value: '15',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      change: 'Days active'
    }
  ];



  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your reading journey today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Borrowings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Current Borrowings</h2>
                <Link to="/borrowing-history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your borrowings...</p>
                </div>
              ) : currentBorrowings.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No current borrowings</h3>
                  <p className="text-gray-500 mb-4">You don't have any books currently borrowed.</p>
                  <Link to="/books" className="btn-primary">
                    Browse Books
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBorrowings.slice(0, 3).map((borrowing) => {
                    const daysOverdue = calculateDaysOverdue(borrowing.dueDate);
                    const isOverdue = daysOverdue > 0;

                    return (
                      <div key={borrowing.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="w-12 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{borrowing.book?.title || 'Unknown Book'}</h3>
                          <p className="text-gray-600 text-sm">{borrowing.book?.author || 'Unknown Author'}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isOverdue ? `Overdue (${daysOverdue} days)` : 'Active'}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</span>
                            </div>
                            {isOverdue && (
                              <div className="flex items-center space-x-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Fine: ${(daysOverdue * 1.00).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReturnBook(borrowing.id)}
                            disabled={returningBooks.has(borrowing.id)}
                            className="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50"
                          >
                            {returningBooks.has(borrowing.id) ? (
                              <>
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Returning...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                <span>Return</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {currentBorrowings.length > 3 && (
                    <div className="text-center pt-4">
                      <Link to="/borrowing-history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View {currentBorrowings.length - 3} more borrowings
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user?.username}</h3>
                  <p className="text-gray-600">Member since 2024</p>
                </div>
              </div>
              <Link to="/profile" className="w-full btn-outline block text-center">
                View Profile
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/books" className="w-full btn-primary text-left flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Books</span>
                </Link>
                <Link to="/borrowing-history" className="w-full btn-outline text-left flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Borrowing History</span>
                </Link>
                <Link to="/wishlist" className="w-full btn-outline text-left flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>My Wishlist</span>
                </Link>
              </div>
            </div>

            {/* Reading Goal */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">2024 Reading Goal</h3>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">12/20</div>
                <p className="text-gray-600 mb-4">Books completed</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-gray-600">8 more books to reach your goal!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
