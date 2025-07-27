import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingBag,
  Tag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { MerchandiseItem } from '../AdminContextTypes';
import MerchandiseForm from '../forms/MerchandiseForm';
import ConfirmDialog from '../shared/ConfirmDialog';
import DataTable from '../shared/DataTable';

const MerchandisePanel: React.FC = () => {
  const { theme } = useTheme();
  const { merchandiseItems, deleteMerchandiseItem } = useAdmin();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MerchandiseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof MerchandiseItem>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort merchandise items
  const filteredItems = useMemo(() => {
    return merchandiseItems
      .filter(item => {
        // Search term filter
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        
        // Status filter
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        // Handle date fields
        if (sortField === 'createdAt') {
          return sortDirection === 'asc'
            ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
            : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
        }
        
        // Handle numeric fields
        if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
          return sortDirection === 'asc'
            ? (a[sortField] as number) - (b[sortField] as number)
            : (b[sortField] as number) - (a[sortField] as number);
        }
        
        // Handle string fields
        return sortDirection === 'asc'
          ? String(a[sortField]).localeCompare(String(b[sortField]))
          : String(b[sortField]).localeCompare(String(a[sortField]));
      });
  }, [merchandiseItems, searchTerm, filterCategory, filterStatus, sortField, sortDirection]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(merchandiseItems.map(item => item.category));
    return Array.from(uniqueCategories);
  }, [merchandiseItems]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof MerchandiseItem);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMerchandiseItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'out-of-stock':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      Header: 'Item',
      accessor: 'title',
      Cell: ({ row }: { row: { original: MerchandiseItem } }) => (
        <div className="flex items-center gap-3">
          {row.original.image ? (
            <img 
              src={row.original.image} 
              alt={row.original.title}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className={`w-10 h-10 rounded flex items-center justify-center ${
              theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
            }`}>
              <ShoppingBag className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {row.original.title}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <Tag className={`w-3 h-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`capitalize ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {row.original.category}
                </span>
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }: { value: number }) => (
        <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          ₹{value.toLocaleString()}
        </span>
      )
    },
    {
      Header: 'Stock',
      accessor: 'stockLevel',
      Cell: ({ row }: { row: { original: MerchandiseItem } }) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.original.status)}
          <span className={`${
            row.original.status === 'in-stock' ? 'text-green-500' :
            row.original.status === 'low-stock' ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            {row.original.stockLevel}
          </span>
        </div>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <span className={`capitalize ${
          value === 'in-stock' ? 'text-green-500' :
          value === 'low-stock' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {value.replace('-', ' ')}
        </span>
      )
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
      Cell: ({ value }: { value: string }) => (
        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }: { row: { original: MerchandiseItem } }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingItem(row.original)}
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setItemToDelete(row.original.id)}
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'hover:bg-gray-100 text-red-600' 
                : 'hover:bg-gray-700 text-red-400'
            }`}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Merchandise
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Manage your merchandise inventory
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
          <button
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search merchandise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'light'
                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Statuses</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Merchandise Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredItems}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>

      {/* Add/Edit Merchandise Modal */}
      {(isAddModalOpen || editingItem) && (
        <MerchandiseForm
          item={editingItem}
          isOpen={isAddModalOpen || !!editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Merchandise Item"
        message="Are you sure you want to delete this merchandise item? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default MerchandisePanel;