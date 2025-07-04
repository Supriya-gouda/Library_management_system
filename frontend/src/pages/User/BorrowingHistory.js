import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle, Clock, RotateCcw, DollarSign } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const BorrowingHistory = () => {
  const [currentBorrowings, setCurrentBorrowings] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [returningBooks, setReturningBooks] = useState(new Set());

  useEffect(() => {
    fetchBorrowingData();
  }, []);

  const fetchBorrowingData = async () => {
    try {
      setLoading(true);
      const [currentResponse, historyResponse] = await Promise.all([
        userAPI.getCurrentBorrowings(),
        userAPI.getBorrowingHistory()
      ]);
      setCurrentBorrowings(currentResponse.data || []);
      setBorrowingHistory(historyResponse.data || []);
    } catch (error) {
      console.error('Error fetching borrowing data:', error);
      // Set empty arrays on error instead of showing error toast
      setCurrentBorrowings([]);
      setBorrowingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    if (returningBooks.has(borrowingId)) {
      return; // Already returning this book
    }

    try {
      setReturningBooks(prev => new Set([...prev, borrowingId]));
      const response = await userAPI.returnBook(borrowingId);

      // Show success message with fine information if applicable
      if (response.data.fine && response.data.fine > 0) {
        toast.success(`Book returned successfully! Fine: $${response.data.fine}`);
      } else {
        toast.success('Book returned successfully!');
      }

      // Refresh the borrowing data
      fetchBorrowingData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to return book';
      toast.error(errorMessage);
      console.error('Error returning book:', error);
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

  const calculateFine = (daysOverdue) => {
    return daysOverdue * 1.00; // $1.00 per day
  };

  const getStatusInfo = (borrowing) => {
    if (borrowing.returnDate) {
      return {
        status: 'returned',
        color: 'bg-green-100 text-green-800',
        text: 'Returned'
      };
    }

    const daysOverdue = calculateDaysOverdue(borrowing.dueDate);
    if (daysOverdue > 0) {
      return {
        status: 'overdue',
        color: 'bg-red-100 text-red-800',
        text: `Overdue (${daysOverdue} days)`,
        fine: calculateFine(daysOverdue)
      };
    }

    return {
      status: 'active',
      color: 'bg-blue-100 text-blue-800',
      text: 'Active'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading borrowing data...</p>
        </div>
      </div>
    );
  }

  const renderBorrowingCard = (borrowing, index, showReturnButton = false) => {
    const statusInfo = getStatusInfo(borrowing);

    return (
      <motion.div
        key={borrowing.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
      >
        <div className="w-12 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{borrowing.book?.title || 'Unknown Book'}</h3>
          <p className="text-gray-600 text-sm">{borrowing.book?.author || 'Unknown Author'}</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Borrowed: {new Date(borrowing.borrowDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</span>
            </div>
            {borrowing.returnDate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Returned: {new Date(borrowing.returnDate).toLocaleDateString()}</span>
              </div>
            )}
            {statusInfo.fine && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <DollarSign className="w-4 h-4" />
                <span>Fine: ${statusInfo.fine.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
          {showReturnButton && !borrowing.returnDate && (
            <button
              onClick={() => handleReturnBook(borrowing.id)}
              disabled={returningBooks.has(borrowing.id)}
              className="btn-primary text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              {returningBooks.has(borrowing.id) ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Returning...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Return</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">My Borrowings</h1>
          <p className="text-gray-600">Manage your current borrowings and view your reading history</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'current'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Current Borrowings ({currentBorrowings.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              History ({borrowingHistory.length})
            </button>
          </div>
        </motion.div>

        {/* Current Borrowings Tab */}
        {activeTab === 'current' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            {currentBorrowings.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No current borrowings</h3>
                <p className="text-gray-500">You don't have any books currently borrowed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentBorrowings.map((borrowing, index) =>
                  renderBorrowingCard(borrowing, index, true)
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            {borrowingHistory.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No borrowing history</h3>
                <p className="text-gray-500">You haven't returned any books yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {borrowingHistory.map((borrowing, index) =>
                  renderBorrowingCard(borrowing, index, false)
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BorrowingHistory;
