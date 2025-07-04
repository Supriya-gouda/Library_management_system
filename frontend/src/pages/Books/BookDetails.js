import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Calendar, User, ArrowLeft, Heart, Download, HeartOff } from 'lucide-react';
import { booksAPI, userAPI, digitalBooksAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    if (isAuthenticated()) {
      checkWishlistStatus();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      toast.error('Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to borrow books');
      return;
    }

    try {
      setBorrowing(true);
      const response = await userAPI.borrowBook(id);
      toast.success('Book borrowed successfully! Due date: ' + new Date(response.data.dueDate).toLocaleDateString());
      fetchBookDetails(); // Refresh book details
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to borrow book';
      toast.error(errorMessage);
      console.error('Error borrowing book:', error);
    } finally {
      setBorrowing(false);
    }
  };

  const handleDigitalDownload = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to download books');
      return;
    }

    try {
      // Get digital book details first
      const digitalBookResponse = await digitalBooksAPI.getByBookId(id);
      if (digitalBookResponse.data && digitalBookResponse.data.length > 0) {
        const digitalBook = digitalBookResponse.data[0];
        const downloadResponse = await digitalBooksAPI.download(digitalBook.id);

        // Create blob and download
        const blob = new Blob([downloadResponse.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${book.title}.${digitalBook.fileFormat.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Download started!');
      } else {
        toast.error('Digital version not available');
      }
    } catch (error) {
      toast.error('Failed to download book');
      console.error('Error downloading book:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await userAPI.getWishlist();
      const wishlistItems = response.data;
      setIsInWishlist(wishlistItems.some(item => item.book.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await userAPI.removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success('Book removed from wishlist');
      } else {
        await userAPI.addToWishlist(id);
        setIsInWishlist(true);
        toast.success('Book added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error('Error updating wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Book not found</h3>
          <Link to="/books" className="btn-primary">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/books"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-20 h-20 text-white" />
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleBorrow}
                  disabled={borrowing || book.availableCopies === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {borrowing ? 'Borrowing...' : book.availableCopies > 0 ? 'Borrow Book' : 'Not Available'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-full flex items-center justify-center space-x-2 ${
                    isInWishlist
                      ? 'btn-primary bg-red-500 hover:bg-red-600'
                      : 'btn-outline'
                  }`}
                >
                  {wishlistLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isInWishlist ? (
                    <HeartOff className="w-4 h-4" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                  <span>
                    {wishlistLoading
                      ? 'Updating...'
                      : isInWishlist
                      ? 'Remove from Wishlist'
                      : 'Add to Wishlist'
                    }
                  </span>
                </button>

                {book.hasDigitalCopy && (
                  <button
                    onClick={handleDigitalDownload}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Digital Copy</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-4">{book.title}</h1>
                <p className="text-2xl text-gray-600 mb-6">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">4.5/5 (123 reviews)</span>
                </div>
              </div>

              {/* Book Information */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span><strong>Author:</strong> {book.author}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span><strong>Genre:</strong> {book.genre}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span><strong>Published:</strong> 2023</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Total Copies:</span>
                      <span className="font-semibold">{book.totalCopies}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Available:</span>
                      <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.availableCopies}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Digital Copy:</span>
                      <span className={`font-semibold ${book.hasDigitalCopy ? 'text-green-600' : 'text-gray-400'}`}>
                        {book.hasDigitalCopy ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  This is a fascinating book that takes readers on an incredible journey through the world of literature.
                  With compelling characters and an engaging plot, this book is perfect for readers who enjoy {book.genre.toLowerCase()}
                  stories. The author masterfully weaves together themes of adventure, discovery, and human nature in this
                  captivating tale that will keep you turning pages until the very end.
                </p>
              </div>

              {/* Similar Books */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="text-center">
                      <div className="aspect-[3/4] bg-gradient-to-br from-accent-400 to-primary-400 rounded-lg flex items-center justify-center mb-2">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-800">Similar Book {item}</p>
                      <p className="text-xs text-gray-600">Author Name</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
