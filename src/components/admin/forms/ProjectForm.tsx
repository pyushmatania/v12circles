import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { Project } from '../../../types/index';

interface ProjectFormProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { addProject, updateProject } = useAdmin();
  
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    type: 'film',
    category: '',
    language: '',
    poster: '',
    fundedPercentage: 0,
    targetAmount: 0,
    raisedAmount: 0,
    timeLeft: '',
    tags: [],
    description: '',
    director: '',
    artist: '',
    genre: '',
    perks: [],
    rating: undefined,
    investorCount: undefined,
    trailer: '',
    imageValidated: undefined,
    imageSource: '',
    status: 'active',
    movie: '',
    keyPeople: [],
    actor: '',
    actress: '',
    productionHouse: '',
    targetAmountHuman: '',
    raisedAmountHuman: '',
    keyCommunityData: [],
    disabled: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        type: project.type,
        category: project.category,
        language: project.language || '',
        poster: project.poster || '',
        fundedPercentage: project.fundedPercentage,
        targetAmount: project.targetAmount,
        raisedAmount: project.raisedAmount,
        timeLeft: project.timeLeft || '',
        tags: project.tags || [],
        description: project.description || '',
        director: project.director || '',
        artist: project.artist || '',
        genre: project.genre || '',
        perks: project.perks || [],
        rating: project.rating,
        investorCount: project.investorCount,
        trailer: project.trailer || '',
        imageValidated: project.imageValidated,
        imageSource: project.imageSource || '',
        status: project.status || 'active',
        movie: project.movie || '',
        keyPeople: project.keyPeople || [],
        actor: project.actor || '',
        actress: project.actress || '',
        productionHouse: project.productionHouse || '',
        targetAmountHuman: project.targetAmountHuman || '',
        raisedAmountHuman: project.raisedAmountHuman || '',
        keyCommunityData: project.keyCommunityData || [],
        disabled: project.disabled ?? false
      });
      
      if (project.poster) {
        setPosterPreview(project.poster);
      }
    }
  }, [project]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPosterFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the poster file to a server
      // and get back a URL to store in the database
      
      // For this demo, we'll just use the preview URL if a new file was selected
      const posterUrl = posterFile ? posterPreview : formData.poster;
      
      if (project) {
        // Update existing project
        updateProject(project.id, {
          ...formData,
          poster: posterUrl
        });
      } else {
        // Add new project
        addProject({
          ...formData,
          poster: posterUrl
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
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
          className={`relative w-full max-w-3xl rounded-lg p-6 shadow-xl ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {project ? 'Edit Project' : 'Add New Project'}
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
                  Project Title
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
                  placeholder="Enter project title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Project Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="film">Film</option>
                  <option value="music">Music</option>
                  <option value="webseries">Web Series</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.category
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="e.g., Bollywood, Regional, Hollywood"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.targetAmount
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter target amount"
                />
                {errors.targetAmount && (
                  <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Raised Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.raisedAmount}
                  onChange={(e) => {
                    const raised = Number(e.target.value);
                    handleInputChange('raisedAmount', raised);
                    
                    // Auto-calculate funded percentage
                    if (formData.targetAmount > 0) {
                      const percentage = Math.min(100, Math.round((raised / formData.targetAmount) * 100));
                      handleInputChange('fundedPercentage', percentage);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter raised amount"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Funded Percentage
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={formData.fundedPercentage}
                    onChange={(e) => handleInputChange('fundedPercentage', Math.min(100, Number(e.target.value)))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                  />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>%</span>
                </div>
                <div className="mt-2">
                  <div className={`w-full h-2 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    <div 
                      className={`h-2 rounded-full ${
                        formData.type === 'film' ? 'bg-purple-500' :
                        formData.type === 'music' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${formData.fundedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Poster Image
                </label>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 border-2 border-dashed rounded-lg p-4 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                  }`}>
                    <div className="flex items-center justify-center">
                      {posterPreview ? (
                        <div className="relative">
                          <img 
                            src={posterPreview} 
                            alt="Poster preview" 
                            className="h-40 object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPosterPreview('');
                              setPosterFile(null);
                              handleInputChange('poster', '');
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className={`w-10 h-10 mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Click to upload poster
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePosterChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Or enter URL:
                    </p>
                    <input
                      type="text"
                      value={formData.poster}
                      onChange={(e) => {
                        handleInputChange('poster', e.target.value);
                        if (e.target.value) {
                          setPosterPreview(e.target.value);
                        }
                      }}
                      className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                        theme === 'light'
                          ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                          : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>
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
                  'Save Project'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectForm;