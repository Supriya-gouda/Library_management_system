import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, FileText } from 'lucide-react';
import { booksAPI, digitalBooksAPI } from '../../services/api';
import { toast } from 'react-toastify';

const DigitalBooks = () => {
  const [digitalBooks, setDigitalBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  useEffect(() => {
    fetchDigitalBooks();
  }, []);

  const fetchDigitalBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getDigital();
      setDigitalBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch digital books');
      console.error('Error fetching digital books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (bookId) => {
    try {
      // Get digital book details first
      const digitalBookResponse = await digitalBooksAPI.getByBookId(bookId);
      if (digitalBookResponse.data && digitalBookResponse.data.length > 0) {
        const digitalBook = digitalBookResponse.data[0];
        const downloadResponse = await digitalBooksAPI.download(digitalBook.id);
        
        // Create blob and download
        const blob = new Blob([downloadResponse.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${digitalBook.book.title}.${digitalBook.fileFormat.toLowerCase()}`;
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

  const filteredBooks = digitalBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = selectedFormat === '' || book.digitalFormats?.includes(selectedFormat);
    return matchesSearch && matchesFormat;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading digital books...</p>
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Digital Library</h1>
          <p className="text-gray-600">Access your digital collection anytime, anywhere</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search digital books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Formats</option>
                <option value="PDF">PDF</option>
                <option value="EPUB">EPUB</option>
                <option value="MOBI">MOBI</option>
                <option value="TXT">TXT</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Digital Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover group"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-green-400 to-blue-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <FileText className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {book.title}
              </h3>
              
              <p className="text-gray-600 mb-2">{book.author}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Digital
                </span>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Available</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={`/digital-books/read/${book.id}`}
                  className="flex-1 btn-primary text-sm flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Read</span>
                </Link>
                <button
                  onClick={() => handleDownload(book.id)}
                  className="btn-outline text-sm px-3 flex items-center justify-center"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
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
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No digital books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DigitalBooks;
