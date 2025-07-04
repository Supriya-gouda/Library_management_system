import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Star, Trash2 } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      toast.error('Failed to fetch wishlist');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await userAPI.removeFromWishlist(bookId);
      setWishlist(prev => prev.filter(item => item.book.id !== bookId));
      toast.success('Book removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">My Wishlist</h1>
          <p className="text-gray-600">Books you want to read later</p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding books you'd like to read!</p>
            <Link to="/books" className="btn-primary">
              Browse Books
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover group relative"
              >
                <button
                  onClick={() => removeFromWishlist(item.book.id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200 z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="aspect-[3/4] bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {item.book.title}
                </h3>
                
                <p className="text-gray-600 mb-2">{item.book.author}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                    {item.book.genre}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {item.book.availableCopies} available
                  </span>
                  <span className="text-xs text-gray-500">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/books/${item.book.id}`}
                    className="flex-1 btn-primary text-sm text-center"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
