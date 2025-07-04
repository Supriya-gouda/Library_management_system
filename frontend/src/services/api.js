import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only logout on authentication endpoints or critical auth failures
    if (error.response?.status === 401 &&
        (error.config?.url?.includes('/auth/') ||
         error.response?.data?.message?.includes('JWT') ||
         error.response?.data?.message?.includes('token'))) {
      // Token expired or invalid - only for auth-related endpoints
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/signin', credentials),
  register: (userData) => api.post('/api/auth/signup', userData),
};

export const booksAPI = {
  getAll: () => api.get('/api/books'),
  getById: (id) => api.get(`/api/books/${id}`),
  search: (searchData) => api.post('/api/books/search', searchData),
  getPopular: () => api.get('/api/books/popular'),
  getTrending: () => api.get('/api/books/trending'),
  getAvailable: () => api.get('/api/books/available'),
  getDigital: () => api.get('/api/books/digital'),
  getRecommendations: () => api.get('/api/books/recommendations'),
  getSimilar: (id) => api.get(`/api/books/${id}/similar`),
};

export const adminAPI = {
  // Books
  getAllBooks: () => api.get('/api/admin/books'),
  addBook: (bookData) => api.post('/api/admin/books', bookData),
  updateBook: (id, bookData) => api.put(`/api/admin/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/api/admin/books/${id}`),
  
  // Members
  getAllMembers: () => api.get('/api/admin/members'),
  getMemberById: (id) => api.get(`/api/admin/members/${id}`),
  createMember: (memberData) => api.post('/api/admin/members', memberData),
  updateMember: (id, memberData) => api.put(`/api/admin/members/${id}`, memberData),
  deleteMember: (id) => api.delete(`/api/admin/members/${id}`),
  
  // Borrowings
  getAllBorrowings: () => api.get('/api/admin/borrowings'),
  getOverdueBorrowings: () => api.get('/api/admin/stats/overdue-books'),
  updateBorrowing: (id, borrowingData) => api.put(`/api/admin/borrowings/${id}`, borrowingData),

  // Users
  getAllUsers: () => api.get('/api/admin/users'),
  createAdminUser: (userData) => api.post('/api/admin/users/admin', userData),
  updateUserRole: (id, roleData) => api.put(`/api/admin/users/${id}/role`, roleData),

  // Statistics
  getStats: () => api.get('/api/admin/stats'),
  getDashboardStats: () => api.get('/api/admin/stats/dashboard'),
  getBorrowingStats: () => api.get('/api/admin/stats/borrowings'),
  getMemberStats: () => api.get('/api/admin/stats/members'),
  getBookStats: () => api.get('/api/admin/stats/books'),
};

export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (profileData) => api.put('/api/user/profile', profileData),
  getCurrentBorrowings: () => api.get('/api/borrowings/current'),
  getBorrowingHistory: () => api.get('/api/borrowings/history'),
  borrowBook: (bookId) => api.post(`/api/borrowings/borrow/${bookId}`),
  returnBook: (borrowingId) => api.put(`/api/borrowings/return/${borrowingId}`),
  renewBook: (borrowingId) => api.put(`/api/borrowings/renew/${borrowingId}`),
  getWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (bookId) => api.post(`/api/wishlist/${bookId}`),
  removeFromWishlist: (bookId) => api.delete(`/api/wishlist/${bookId}`),
};

export const digitalBooksAPI = {
  getAll: () => api.get('/api/digital-books'),
  getByBookId: (bookId) => api.get(`/api/digital-books/book/${bookId}`),
  download: (id) => api.get(`/api/digital-books/download/${id}`, { responseType: 'blob' }),
  upload: (formData) => api.post('/api/digital-books/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/digital-books/${id}`),
};

export default api;
