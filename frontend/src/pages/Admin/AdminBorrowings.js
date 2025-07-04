import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Calendar, Clock, Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct borrowings endpoint, we'll use overdue books
      // In a real implementation, you'd have an endpoint that returns all borrowings
      const overdueResponse = await adminAPI.getOverdueBorrowings();

      // For demo purposes, we'll show overdue borrowings
      // In production, you'd fetch all borrowings and filter them
      setBorrowings(overdueResponse.data || []);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      toast.error('Failed to fetch borrowings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (borrowing) => {
    const dueDate = new Date(borrowing.dueDate);
    const today = new Date();

    if (borrowing.returnDate) {
      return 'bg-green-100 text-green-800';
    } else if (dueDate < today) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (borrowing) => {
    const dueDate = new Date(borrowing.dueDate);
    const today = new Date();

    if (borrowing.returnDate) {
      return 'Returned';
    } else if (dueDate < today) {
      return 'Overdue';
    } else {
      return 'Active';
    }
  };

  const filteredBorrowings = borrowings.filter(borrowing => {
    const matchesSearch =
      borrowing.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.member?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;

    const status = getStatusText(borrowing).toLowerCase();
    return matchesSearch && status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading borrowings...</p>
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
              <h1 className="text-4xl font-bold gradient-text mb-2">Manage Borrowings</h1>
              <p className="text-gray-600">Monitor and manage book borrowing activities</p>
            </div>
            <button
              onClick={fetchBorrowings}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book title or member name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Borrowings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBorrowings.map((borrowing, index) => (
                  <motion.tr
                    key={borrowing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded flex items-center justify-center mr-4">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {borrowing.book?.title || 'Unknown Book'}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {borrowing.book?.author || 'Unknown Author'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">
                            {borrowing.member?.fullName || 'Unknown Member'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {borrowing.member?.id || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {borrowing.borrowDate ? new Date(borrowing.borrowDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {borrowing.dueDate ? new Date(borrowing.dueDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(borrowing)}`}>
                          {getStatusText(borrowing)}
                        </span>
                        {getStatusText(borrowing) === 'Overdue' && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {borrowing.fine && (
                        <div className="text-xs text-red-600 mt-1">
                          Fine: ${borrowing.fine}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredBorrowings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No borrowings found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'No borrowing activities to display'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminBorrowings;
