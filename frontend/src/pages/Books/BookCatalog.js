import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Star, Download } from 'lucide-react';
import { booksAPI, userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const BookCatalog = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [borrowingBooks, setBorrowingBooks] = useState(new Set());

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    if (!isAuthenticated()) {
      toast.error('Please login to borrow books');
      return;
    }

    if (borrowingBooks.has(bookId)) {
      return; // Already borrowing this book
    }

    try {
      setBorrowingBooks(prev => new Set([...prev, bookId]));
      const response = await userAPI.borrowBook(bookId);
      toast.success('Book borrowed successfully! Due date: ' + new Date(response.data.dueDate).toLocaleDateString());

      // Update the book's available copies
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId
            ? { ...book, availableCopies: Math.max(0, book.availableCopies - 1) }
            : book
        )
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to borrow book';
      toast.error(errorMessage);
      console.error('Error borrowing book:', error);
    } finally {
      setBorrowingBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(books.map(book => book.genre))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Book Catalog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next favorite book from our extensive collection
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input-field pl-10 pr-8"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover group"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {book.title}
              </h3>
              
              <p className="text-gray-600 mb-2">{book.author}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                  {book.genre}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {book.availableCopies} available
                </span>
                {book.hasDigitalCopy && (
                  <Download className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleBorrow(book.id)}
                  disabled={book.availableCopies === 0 || borrowingBooks.has(book.id)}
                  className={`flex-1 text-sm ${
                    book.availableCopies === 0
                      ? 'btn-disabled'
                      : borrowingBooks.has(book.id)
                      ? 'btn-disabled'
                      : 'btn-primary'
                  }`}
                >
                  {borrowingBooks.has(book.id)
                    ? 'Borrowing...'
                    : book.availableCopies === 0
                    ? 'Not Available'
                    : 'Borrow'
                  }
                </button>
                <Link to={`/books/${book.id}`} className="btn-outline text-sm px-3">
                  Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
