import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader, Plus, Image, Video, FileAudio, FileText } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { MediaAsset } from '../AdminContextTypes';
import { useDropzone } from 'react-dropzone';

interface MediaFormProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({ asset, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { addMediaAsset, updateMediaAsset, projects } = useAdmin();
  
  const [formData, setFormData] = useState<Omit<MediaAsset, 'id' | 'createdAt'>>({
    title: '',
    type: 'image',
    url: '',
    fileSize: 0,
    dimensions: '',
    projectId: '',
    tags: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        type: asset.type,
        url: asset.url,
        fileSize: asset.fileSize,
        dimensions: asset.dimensions || '',
        projectId: asset.projectId || '',
        tags: [...asset.tags]
      });
      
      if (asset.type === 'image' && asset.url) {
        setMediaPreview(asset.url);
      }
    }
  }, [asset]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setMediaFile(file);
    
    // Determine file type
    let type: MediaAsset['type'] = 'document';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    } else if (file.type.startsWith('audio/')) {
      type = 'audio';
    }
    
    // Create preview URL for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Get dimensions for images
    if (type === 'image') {
      const img = new window.Image();
      img.onload = () => {
        setFormData(prev => ({
          ...prev,
          dimensions: `${img.width}x${img.height}`
        }));
      };
      img.src = URL.createObjectURL(file);
    }
    
    setFormData(prev => ({
      ...prev,
      type,
      fileSize: file.size,
      title: file.name
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    }
  });

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
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url && !mediaFile) {
      newErrors.url = 'Please provide a file or URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the file to a server
      // and get back a URL to store in the database
      
      // For this demo, we'll just use the preview URL if a new file was selected
      const url = mediaFile ? mediaPreview || formData.url : formData.url;
      
      if (asset) {
        // Update existing asset
        updateMediaAsset(asset.id, {
          ...formData,
          url
        });
      } else {
        // Add new asset
        addMediaAsset({
          ...formData,
          url
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving media asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-red-500" />;
      case 'audio':
        return <FileAudio className="w-6 h-6 text-green-500" />;
      case 'document':
        return <FileText className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
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
              {asset ? 'Edit Media Asset' : 'Add New Media Asset'}
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
                  Media Title
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
                  placeholder="Enter media title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Media Type
                </label>
                <div className="flex items-center gap-2">
                  {getTypeIcon(formData.type)}
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                  </select>
                </div>
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

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Media File
                </label>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 ${
                  isDragActive
                    ? theme === 'light' ? 'border-purple-400 bg-purple-50' : 'border-purple-500 bg-purple-900/20'
                    : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                }`}>
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center text-center">
                    {mediaPreview && formData.type === 'image' ? (
                      <div className="relative">
                        <img 
                          src={mediaPreview} 
                          alt="Media preview" 
                          className="h-40 object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaPreview('');
                            setMediaFile(null);
                            handleInputChange('url', '');
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-12 h-12 mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                        </p>
                        <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Supports images, videos, audio, and documents
                        </p>
                        {formData.fileSize > 0 && (
                          <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                            File size: {(formData.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {errors.url && (
                  <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Media URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => {
                    handleInputChange('url', e.target.value);
                    if (e.target.value && formData.type === 'image') {
                      setMediaPreview(e.target.value);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.url
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="https://example.com/media.jpg"
                />
                <p className={`mt-1 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Enter URL directly or upload a file above
                </p>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        theme === 'light'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className={`px-4 py-2 rounded-lg ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className={`mt-1 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Press Enter to add a tag
                </p>
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
                  'Save Media'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaForm;