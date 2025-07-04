import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">LibraryHub</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Your digital gateway to knowledge. Discover, read, and explore thousands of books 
              with our modern library management system.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/books" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/digital-books" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Digital Books
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/borrowing-history" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Borrowing History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-500 transition-colors duration-200">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 LibraryHub. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center space-x-1 mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for book lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
