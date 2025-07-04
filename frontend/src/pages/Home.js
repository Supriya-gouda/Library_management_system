import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  ArrowRight,
  Download,
  Search,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Access thousands of books across all genres',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Download,
      title: 'Digital Library',
      description: 'Download and read books offline',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find books with our intelligent search system',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Recommendations',
      description: 'Get personalized book recommendations',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Books Available', icon: BookOpen },
    { number: '5,000+', label: 'Active Members', icon: Users },
    { number: '24/7', label: 'Access Time', icon: Clock },
    { number: '4.9/5', label: 'User Rating', icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="gradient-text">Discover</span>
                  <br />
                  <span className="text-gray-800">Your Next</span>
                  <br />
                  <span className="gradient-text">Adventure</span>
                </motion.h1>
                
                <motion.p
                  className="text-xl text-gray-600 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Experience LibroTech's advanced library management system with cutting-edge
                  technology, seamless book management, and beautiful design.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {isAuthenticated() ? (
                  <Link to="/books" className="btn-primary inline-flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Browse Books</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary inline-flex items-center space-x-2">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/books" className="btn-outline inline-flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Browse Books</span>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Content - Floating Books Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Floating Book Cards */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-48 h-64 card card-hover ${
                      i === 1 ? 'z-30' : i === 2 ? 'z-20 -rotate-12 -translate-x-8' : 'z-10 rotate-12 translate-x-8'
                    }`}
                    animate={{
                      y: [0, -20, 0],
                      rotate: i === 1 ? [0, 5, 0] : i === 2 ? [-12, -7, -12] : [12, 17, 12]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${
                      i === 1 ? 'from-blue-400 to-purple-600' : 
                      i === 2 ? 'from-green-400 to-blue-600' : 
                      'from-pink-400 to-red-600'
                    } rounded-xl p-6 text-white flex flex-col justify-between`}>
                      <div>
                        <BookOpen className="w-8 h-8 mb-4" />
                        <h3 className="font-bold text-lg mb-2">
                          {i === 1 ? 'Fiction' : i === 2 ? 'Science' : 'Adventure'}
                        </h3>
                        <p className="text-sm opacity-90">
                          {i === 1 ? 'Explore imaginary worlds' : 
                           i === 2 ? 'Discover new knowledge' : 
                           'Thrilling adventures await'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-75">
                          {i === 1 ? '2,500+ books' : i === 2 ? '1,800+ books' : '3,200+ books'}
                        </span>
                        <Star className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="card card-hover p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
              Why Choose LibroTech?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of library management with our advanced features
              designed to revolutionize your reading and learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card card-hover group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card p-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Ready to Start Reading?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of readers who have already discovered their next favorite book.
            </p>
{!isAuthenticated() && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn-outline">
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
