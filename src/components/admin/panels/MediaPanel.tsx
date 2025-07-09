import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image,
  Video,
  FileAudio,
  FileText,
  Download,
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { MediaAsset } from '../AdminContextTypes';
import MediaForm from '../forms/MediaForm';
import ConfirmDialog from '../shared/ConfirmDialog';
import DataTable from '../shared/DataTable';

const MediaPanel: React.FC = () => {
  const { theme } = useTheme();
  const { mediaAssets, deleteMediaAsset, projects } = useAdmin();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof MediaAsset>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort media assets
  const filteredAssets = useMemo(() => {
    return mediaAssets
      .filter(asset => {
        // Search term filter
        const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Type filter
        const matchesType = filterType === 'all' || asset.type === filterType;
        
        // Project filter
        const matchesProject = filterProject === 'all' || asset.projectId === filterProject;
        
        return matchesSearch && matchesType && matchesProject;
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
  }, [mediaAssets, searchTerm, filterType, filterProject, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof MediaAsset);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (assetToDelete) {
      deleteMediaAsset(assetToDelete);
      setAssetToDelete(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'audio':
        return <FileAudio className="w-4 h-4 text-green-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
  };

  const columns = [
    {
      Header: 'Asset',
      accessor: 'title',
      Cell: ({ row }: { row: { original: MediaAsset } }) => (
        <div className="flex items-center gap-3">
          {row.original.type === 'image' && row.original.url ? (
            <img 
              src={row.original.url} 
              alt={row.original.title}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className={`w-10 h-10 rounded flex items-center justify-center ${
              theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
            }`}>
              {getTypeIcon(row.original.type)}
            </div>
          )}
          <div>
            <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {row.original.title}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                {getTypeIcon(row.original.type)}
                <span className={`capitalize ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {row.original.type}
                </span>
              </span>
              {row.original.dimensions && (
                <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {row.original.dimensions}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      Header: 'Project',
      accessor: 'projectId',
      Cell: ({ row }: { row: { original: MediaAsset } }) => {
        const project = projects.find(p => p.id === row.original.projectId);
        return (
          <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
            {project?.title || 'N/A'}
          </span>
        );
      }
    },
    {
      Header: 'Tags',
      accessor: 'tags',
      Cell: ({ value }: { value: string[] }) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag: string, index: number) => (
            <span 
              key={index}
              className={`px-2 py-0.5 text-xs rounded-full ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {tag}
            </span>
          ))}
          {value.length > 2 && (
            <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              +{value.length - 2} more
            </span>
          )}
        </div>
      )
    },
    {
      Header: 'Size',
      accessor: 'fileSize',
      Cell: ({ value }: { value: number }) => (
        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
          {formatFileSize(value)}
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
      Cell: ({ row }: { row: { original: MediaAsset } }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(row.original.url, '_blank')}
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Open"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => copyToClipboard(row.original.url)}
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingAsset(row.original)}
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
            onClick={() => setAssetToDelete(row.original.id)}
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
            Media Assets
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Manage your media files and assets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Media
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
            placeholder="Search media assets..."
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
        </select>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
      </div>

      {/* Media Assets Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredAssets}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>

      {/* Add/Edit Media Modal */}
      {(isAddModalOpen || editingAsset) && (
        <MediaForm
          asset={editingAsset}
          isOpen={isAddModalOpen || !!editingAsset}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAsset(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!assetToDelete}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media asset? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAssetToDelete(null)}
      />
    </div>
  );
};

export default MediaPanel;