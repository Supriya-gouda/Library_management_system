import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { digitalBooksAPI, booksAPI } from '../../services/api';
import { toast } from 'react-toastify';

const DigitalBookReader = () => {
  const { bookId, digitalBookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [digitalBook, setDigitalBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [zoom, setZoom] = useState(100);

  const fetchBookAndDigitalBook = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching book data for bookId:', bookId, 'digitalBookId:', digitalBookId);

      const bookResponse = await booksAPI.getById(bookId);
      console.log('Book response:', bookResponse.data);
      setBook(bookResponse.data);

      const digitalBooksResponse = await digitalBooksAPI.getByBookId(bookId);
      console.log('Digital books response:', digitalBooksResponse.data);

      if (digitalBooksResponse.data && digitalBooksResponse.data.length > 0) {
        const digitalBookData = digitalBookId
          ? digitalBooksResponse.data.find(db => db.id.toString() === digitalBookId)
          : digitalBooksResponse.data[0];

        if (digitalBookData) {
          console.log('Selected digital book:', digitalBookData);
          setDigitalBook(digitalBookData);

          const fileUrl = `http://localhost:8080/api/digital-books/read/${digitalBookData.id}`;
          setFileUrl(fileUrl);
          console.log('File URL set to:', fileUrl);
        } else {
          toast.error('Digital book not found');
          navigate('/digital-books');
        }
      } else {
        toast.error('No digital version available');
        navigate('/digital-books');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error('Failed to load digital book: ' + errorMessage);
      navigate('/digital-books');
    } finally {
      setLoading(false);
    }
  }, [bookId, digitalBookId, navigate]);

  useEffect(() => {
    fetchBookAndDigitalBook();
  }, [fetchBookAndDigitalBook]);

  const handleDownload = async () => {
    try {
      const response = await digitalBooksAPI.download(digitalBook.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${book.title}.${digitalBook.fileFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download book');
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleFullscreen = () => {
    const iframe = document.getElementById('book-viewer');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading digital book...</p>
        </div>
      </div>
    );
  }

  if (!book || !digitalBook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
          <button onClick={() => navigate('/digital-books')} className="btn-primary">
            Back to Digital Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/digital-books')} className="btn-outline flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{book.title}</h1>
                <p className="text-gray-600">by {book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={handleZoomOut} className="btn-outline p-2" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
              <button onClick={handleZoomIn} className="btn-outline p-2" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={handleFullscreen} className="btn-outline p-2" title="Fullscreen">
                <Maximize className="w-4 h-4" />
              </button>
              <button onClick={handleDownload} className="btn-primary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            {digitalBook.fileFormat === 'PDF' ? (
              <div className="w-full h-full relative">
                <iframe
                  id="book-viewer"
                  src={fileUrl}
                  className="w-full h-full border-0"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                  title={`${book.title} - Digital Book`}
                  onLoad={() => console.log('PDF loaded successfully')}
                  onError={(e) => {
                    console.error('Error loading PDF:', e);
                    toast.error('Failed to load PDF. Please try downloading instead.');
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{digitalBook.fileFormat} Format</h3>
                  <p className="text-gray-600 mb-4">This format requires download to read with a compatible reader.</p>
                  <button onClick={handleDownload} className="btn-primary flex items-center space-x-2 mx-auto">
                    <Download className="w-4 h-4" />
                    <span>Download {digitalBook.fileFormat}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBookReader;
