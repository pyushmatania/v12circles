import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { Perk } from '../AdminContextTypes';

interface PerkFormProps {
  perk: Perk | null;
  isOpen: boolean;
  onClose: () => void;
}

const PerkForm: React.FC<PerkFormProps> = ({ perk, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { addPerk, updatePerk, projects } = useAdmin();
  
  const [formData, setFormData] = useState<Omit<Perk, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    projectId: '',
    projectTitle: '',
    tier: 'supporter',
    minAmount: 10000
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (perk) {
      setFormData({
        title: perk.title,
        description: perk.description,
        projectId: perk.projectId || '',
        projectTitle: perk.projectTitle || '',
        tier: perk.tier,
        minAmount: perk.minAmount
      });
    }
  }, [perk]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Update project title when project is selected
    if (field === 'projectId' && value) {
      const selectedProject = projects.find(p => p.id === value);
      if (selectedProject) {
        setFormData(prev => ({ 
          ...prev, 
          projectTitle: selectedProject.title 
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.minAmount <= 0) {
      newErrors.minAmount = 'Minimum amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (perk) {
        // Update existing perk
        updatePerk(perk.id, formData);
      } else {
        // Add new perk
        addPerk(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving perk:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-lg p-6 shadow-xl ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {perk ? 'Edit Perk' : 'Add New Perk'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Perk Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.title
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter perk title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Describe the perk"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Project
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="">Select Project (Optional)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => handleInputChange('tier', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="supporter">Supporter</option>
                  <option value="backer">Backer</option>
                  <option value="producer">Producer</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Minimum Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => handleInputChange('minAmount', Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.minAmount
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter minimum amount"
                />
                {errors.minAmount && (
                  <p className="mt-1 text-sm text-red-500">{errors.minAmount}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Perk'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PerkForm;