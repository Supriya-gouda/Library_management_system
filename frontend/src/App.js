import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BookCatalog from './pages/Books/BookCatalog';
import BookDetails from './pages/Books/BookDetails';
import DigitalBooks from './pages/Books/DigitalBooks';
import DigitalBookReader from './pages/Books/DigitalBookReader';
import UserProfile from './pages/User/UserProfile';
import BorrowingHistory from './pages/User/BorrowingHistory';
import Wishlist from './pages/User/Wishlist';
import AdminBooks from './pages/Admin/AdminBooks';
import AdminMembers from './pages/Admin/AdminMembers';
import AdminBorrowings from './pages/Admin/AdminBorrowings';
import AdminDigitalBooks from './pages/Admin/AdminDigitalBooks';
import AdminReports from './pages/Admin/AdminReports';
import AdminDebug from './pages/Admin/AdminDebug';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
              {/* Background decorations */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary-300/10 to-accent-300/10 rounded-full blur-3xl"></div>
              </div>

              <Navbar />
              
              <main className="flex-grow relative z-10">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/books" element={<BookCatalog />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/digital-books" element={<DigitalBooks />} />
                  <Route path="/digital-books/read/:bookId" element={
                    <ProtectedRoute>
                      <DigitalBookReader />
                    </ProtectedRoute>
                  } />
                  <Route path="/debug" element={<AdminDebug />} />

                  {/* Protected User Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/borrowing-history" element={
                    <ProtectedRoute>
                      <BorrowingHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/books" element={
                    <ProtectedRoute adminOnly>
                      <AdminBooks />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/members" element={
                    <ProtectedRoute adminOnly>
                      <AdminMembers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/borrowings" element={
                    <ProtectedRoute adminOnly>
                      <AdminBorrowings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/digital-books" element={
                    <ProtectedRoute adminOnly>
                      <AdminDigitalBooks />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <ProtectedRoute adminOnly>
                      <AdminReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/debug" element={
                    <ProtectedRoute adminOnly>
                      <AdminDebug />
                    </ProtectedRoute>
                  } />

                  {/* Catch all route */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>

              <Footer />

              {/* Toast Container */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="mt-16"
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
