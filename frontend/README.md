# 🎨 LibraryHub Frontend

A modern, colorful, and attractive React.js frontend for the Library Management System.

## ✨ Features

### 🎯 **Modern UI/UX Design**
- **Gradient Backgrounds**: Beautiful gradient color schemes
- **Glass Morphism**: Modern glass effect components
- **Smooth Animations**: Framer Motion powered animations
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Theme**: Toggle between themes

### 🔐 **Authentication System**
- **JWT Token Management**: Secure authentication
- **Role-based Access**: Admin and User roles
- **Protected Routes**: Secure page access
- **Auto-logout**: Session management

### 📚 **Book Management**
- **Interactive Catalog**: Browse books with search and filters
- **Book Details**: Detailed book information pages
- **Borrowing System**: Easy book borrowing interface
- **Digital Downloads**: Support for digital books

### 👨‍💼 **Admin Dashboard**
- **Statistics Overview**: Visual stats and metrics
- **Book Management**: Add, edit, delete books
- **Member Management**: View and manage users
- **Borrowing Analytics**: Track borrowing activities

### 🎨 **Design System**
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Color Palette**: Carefully chosen color schemes
- **Typography**: Beautiful font combinations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend API running on http://localhost:8080

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Alternative Setup
Run the setup script:
```bash
setup-frontend.bat
```

## 🎨 Design Features

### **Color Scheme**
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **Accent**: Orange gradient (#f97316 to #ea580c)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### **Components**
- **Cards**: Glass morphism effect with hover animations
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Modern input fields with validation
- **Navigation**: Responsive navbar with smooth transitions
- **Modals**: Animated overlays and dialogs

### **Animations**
- **Page Transitions**: Smooth fade and slide effects
- **Hover Effects**: Interactive element animations
- **Loading States**: Beautiful loading spinners
- **Micro-interactions**: Delightful user feedback

## 📱 Pages Overview

### **Public Pages**
- **Home**: Hero section with features showcase
- **Login**: Beautiful authentication form
- **Register**: User registration with validation
- **Book Catalog**: Public book browsing

### **User Dashboard**
- **Dashboard**: Personal reading statistics
- **Profile**: User profile management
- **Borrowing History**: Track borrowed books
- **Book Search**: Advanced search functionality

### **Admin Panel**
- **Admin Dashboard**: System overview and stats
- **Manage Books**: CRUD operations for books
- **Manage Members**: User management interface
- **Borrowing Management**: Monitor all borrowings

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client for API calls
- **React Query**: Data fetching and caching
- **React Hook Form**: Form management
- **React Toastify**: Beautiful notifications
- **Lucide React**: Modern icon library

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_APP_NAME=LibraryHub
```

### **API Integration**
The frontend automatically connects to the backend API running on port 8080. All API calls are handled through the `services/api.js` file with automatic token management.

## 🎯 Key Features

### **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Adaptive layouts

### **Performance**
- Code splitting and lazy loading
- Optimized bundle size
- Fast page transitions
- Efficient re-renders

### **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus management

### **User Experience**
- Intuitive navigation
- Clear visual hierarchy
- Consistent interactions
- Helpful error messages

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Serve Static Files**
```bash
npm install -g serve
serve -s build -l 3000
```

## 📞 Support

For any issues or questions about the frontend:
1. Check the browser console for errors
2. Ensure the backend API is running
3. Verify all dependencies are installed
4. Check network connectivity

---

**Built with ❤️ using React.js, Tailwind CSS, and modern web technologies**
