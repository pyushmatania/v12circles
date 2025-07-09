import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useTheme } from '../ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${
            theme === 'light' 
              ? 'bg-white/80 backdrop-blur-sm' 
              : 'bg-black/80 backdrop-blur-sm'
          }`}
        />

        {/* Modal */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-lg rounded-2xl border overflow-hidden ${
              theme === 'light'
                ? 'light-glass-header'
                : 'bg-gradient-to-br from-gray-900 to-black border-white/20'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
                theme === 'light'
                  ? 'bg-white/50 text-gray-700 hover:bg-white/70'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <LoginForm
                    key="login"
                    onSwitchToRegister={() => setMode('register')}
                    onClose={onClose}
                  />
                ) : (
                  <RegisterForm
                    key="register"
                    onSwitchToLogin={() => setMode('login')}
                    onClose={onClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;