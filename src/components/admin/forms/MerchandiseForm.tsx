import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { MerchandiseItem } from '../AdminContextTypes';

interface MerchandiseFormProps {
  item: MerchandiseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MerchandiseForm: React.FC<MerchandiseFormProps> = ({ item, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { addMerchandiseItem, updateMerchandiseItem } = useAdmin();
  
  const [formData, setFormData] = useState<Omit<MerchandiseItem, 'id' | 'createdAt'>>({
    title: '',
    category: '',
    price: 0,
    stockLevel: 0,
    status: 'in-stock',
    image: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        category: item.category,
        price: item.price,
        stockLevel: item.stockLevel,
        status: item.status,
        image: item.image || ''
      });
      
      if (item.image) {
        setImagePreview(item.image);
      }
    }
  }, [item]);

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
    
    // Auto-update status based on stock level
    if (field === 'stockLevel') {
      const stockLevel = Number(value);
      let status: MerchandiseItem['status'] = 'in-stock';
      
      if (stockLevel === 0) {
        status = 'out-of-stock';
      } else if (stockLevel <= 10) {
        status = 'low-stock';
      }
      
      setFormData(prev => ({ ...prev, status }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
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
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.stockLevel < 0) {
      newErrors.stockLevel = 'Stock level cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the image file to a server
      // and get back a URL to store in the database
      
      // For this demo, we'll just use the preview URL if a new file was selected
      const imageUrl = imageFile ? imagePreview : formData.image;
      
      if (item) {
        // Update existing item
        updateMerchandiseItem(item.id, {
          ...formData,
          image: imageUrl
        });
      } else {
        // Add new item
        addMerchandiseItem({
          ...formData,
          image: imageUrl
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving merchandise item:', error);
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
              {item ? 'Edit Merchandise Item' : 'Add New Merchandise Item'}
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
                  Item Title
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
                  placeholder="Enter merchandise title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.category
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option value="">Select Category</option>
                  <option value="apparel">Apparel</option>
                  <option value="accessories">Accessories</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="limited-editions">Limited Editions</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.price
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Stock Level
                </label>
                <input
                  type="number"
                  value={formData.stockLevel}
                  onChange={(e) => handleInputChange('stockLevel', Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.stockLevel
                      ? 'border-red-500'
                      : theme === 'light'
                        ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                        : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="Enter stock level"
                />
                {errors.stockLevel && (
                  <p className="mt-1 text-sm text-red-500">{errors.stockLevel}</p>
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
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Item Image
                </label>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 border-2 border-dashed rounded-lg p-4 ${
                    theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                  }`}>
                    <div className="flex items-center justify-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Item preview" 
                            className="h-40 object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setImageFile(null);
                              handleInputChange('image', '');
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
                            Click to upload image
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
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
                      value={formData.image}
                      onChange={(e) => {
                        handleInputChange('image', e.target.value);
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                        }
                      }}
                      className={`mt-2 w-full px-4 py-2 rounded-lg border ${
                        theme === 'light'
                          ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                          : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      placeholder="https://example.com/image.jpg"
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
                  'Save Item'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MerchandiseForm;