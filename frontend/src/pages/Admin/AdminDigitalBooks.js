import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, Trash2, Eye, X, Upload } from 'lucide-react';
import { digitalBooksAPI, booksAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDigitalBooks = () => {
  const [digitalBooks, setDigitalBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    bookId: '',
    fileFormat: 'PDF',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [digitalBooksResponse, booksResponse] = await Promise.all([
        digitalBooksAPI.getAll(),
        booksAPI.getAll()
      ]);
      setDigitalBooks(digitalBooksResponse.data);
      setBooks(booksResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDigitalBook = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding digital book with data:', addFormData);

      // Validate form data
      if (!addFormData.bookId) {
        toast.error('Please select a book');
        return;
      }

      if (!addFormData.fileFormat) {
        toast.error('Please select a file format');
        return;
      }

      if (!addFormData.file) {
        toast.error('Please select a file to upload');
        return;
      }

      // Check file size (10MB limit)
      if (addFormData.file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      const formData = new FormData();
      formData.append('bookId', addFormData.bookId);
      formData.append('fileFormat', addFormData.fileFormat);
      formData.append('file', addFormData.file);

      console.log('Uploading file:', addFormData.file.name, 'Size:', addFormData.file.size);

      const response = await digitalBooksAPI.upload(formData);
      console.log('Digital book uploaded successfully:', response.data);

      setDigitalBooks([...digitalBooks, response.data]);
      setShowAddModal(false);
      setAddFormData({ bookId: '', fileFormat: 'PDF', file: null });
      toast.success('Digital book added successfully!');

      // Refresh the list to ensure we have the latest data
      fetchData();
    } catch (error) {
      console.error('Error adding digital book:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add digital book';
      toast.error(errorMessage);
    }
  };

  const handleDeleteDigitalBook = async (digitalBookId) => {
    if (window.confirm('Are you sure you want to delete this digital book?')) {
      try {
        await digitalBooksAPI.delete(digitalBookId);
        setDigitalBooks(digitalBooks.filter(db => db.id !== digitalBookId));
        toast.success('Digital book deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete digital book');
      }
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setAddFormData({ bookId: '', fileFormat: 'PDF', file: null });
  };

  const filteredDigitalBooks = digitalBooks.filter(digitalBook => {
    const book = books.find(b => b.id === digitalBook.bookId);
    return book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           digitalBook.fileFormat?.toLowerCase().includes(searchTerm.toLowerCase());
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Manage Digital Books</h1>
              <p className="text-gray-600">Upload and manage digital book files</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Digital Book</span>
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by book title, author, or format..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </motion.div>

        {/* Digital Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDigitalBooks.map((digitalBook, index) => {
            const book = books.find(b => b.id === digitalBook.bookId);
            return (
              <motion.div
                key={digitalBook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {book?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book?.author || 'Unknown Author'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {digitalBook.fileFormat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/digital-books/read/${digitalBook.bookId}`, '_blank')}
                    className="btn-outline flex items-center space-x-1 text-sm flex-1"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDigitalBook(digitalBook.id)}
                    className="btn-outline text-red-600 hover:bg-red-50 p-2"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredDigitalBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No digital books found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding some digital books'}
            </p>
          </motion.div>
        )}

        {/* Add Digital Book Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Digital Book</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddDigitalBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                  <select
                    value={addFormData.bookId}
                    onChange={(e) => setAddFormData({...addFormData, bookId: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select a book</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Format</label>
                  <select
                    value={addFormData.fileFormat}
                    onChange={(e) => setAddFormData({...addFormData, fileFormat: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="MOBI">MOBI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="file"
                      onChange={(e) => setAddFormData({...addFormData, file: e.target.files[0]})}
                      className="input-field pl-10"
                      accept=".pdf,.epub,.mobi"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  <button type="button" onClick={closeModals} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDigitalBooks;
