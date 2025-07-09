import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader, Shield, ArrowLeft } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { login, isLoading } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${
          theme === 'light' 
            ? 'bg-white' 
            : 'bg-gray-800 border border-gray-700'
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Admin Dashboard
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Sign in to access the admin panel
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className={`flex items-center gap-2 mb-6 ${
            theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className={`text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
              {error}
            </span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className={`p-4 rounded-lg ${
            theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-800/30'
          }`}>
            <p className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
              Demo Credentials:
            </p>
            <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
              Username: <span className="font-mono">admin</span><br />
              Password: <span className="font-mono">admin</span>
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            This is a secure area. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;