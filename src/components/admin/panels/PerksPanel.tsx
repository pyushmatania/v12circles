import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Film,
  Music,
  Tv,
  Download,
  RefreshCw,
  Medal,
  Box,
  Gem,
  Badge
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { Perk } from '../AdminContextTypes';
import PerkForm from '../forms/PerkForm';
import ConfirmDialog from '../shared/ConfirmDialog';
import DataTable from '../shared/DataTable';

const PerksPanel: React.FC = () => {
  const { theme } = useTheme();
  const { perks, deletePerk, projects } = useAdmin();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [perkToDelete, setPerkToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Perk>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort perks
  const filteredPerks = useMemo(() => {
    return perks
      .filter(perk => {
        // Search term filter
        const matchesSearch = perk.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             perk.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Tier filter
        const matchesTier = filterTier === 'all' || perk.tier === filterTier;
        
        // Project filter
        const matchesProject = filterProject === 'all' || perk.projectId === filterProject;
        
        return matchesSearch && matchesTier && matchesProject;
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
  }, [perks, searchTerm, filterTier, filterProject, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof Perk);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (perkToDelete) {
      deletePerk(perkToDelete);
      setPerkToDelete(null);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'supporter':
        return <Medal className={`w-4 h-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`} />;
      case 'backer':
        return <Box className={`w-4 h-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`} />;
      case 'producer':
        return <Gem className={`w-4 h-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`} />;
      case 'executive':
        return <Badge className={`w-4 h-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`} />;
      default:
        return null;
    }
  };

  const getProjectTypeIcon = (projectId?: string) => {
    if (!projectId) return null;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    
    switch (project.type) {
      case 'film':
        return <Film className="w-4 h-4 text-purple-400" />;
      case 'music':
        return <Music className="w-4 h-4 text-blue-400" />;
      case 'webseries':
        return <Tv className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      Header: 'Perk',
      accessor: 'title',
      Cell: ({ row }: { row: { original: Perk } }) => (
        <div>
          <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {row.original.title}
          </p>
          <p className={`text-sm truncate max-w-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {row.original.description}
          </p>
        </div>
      )
    },
    {
      Header: 'Project',
      accessor: 'projectTitle',
      Cell: ({ row }: { row: { original: Perk } }) => (
        <div className="flex items-center gap-2">
          {getProjectTypeIcon(row.original.projectId)}
          <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
            {row.original.projectTitle || 'N/A'}
          </span>
        </div>
      )
    },
    {
      Header: 'Tier',
      accessor: 'tier',
      Cell: ({ row }: { row: { original: Perk } }) => (
        <div className="flex items-center gap-2">
          {getTierIcon(row.original.tier)}
          <span className={`capitalize ${
            row.original.tier === 'supporter' ? 'text-gray-500' :
            row.original.tier === 'backer' ? 'text-blue-500' :
            row.original.tier === 'producer' ? 'text-purple-500' :
            'text-yellow-500'
          }`}>
            {row.original.tier}
          </span>
        </div>
      )
    },
    {
      Header: 'Min. Amount',
      accessor: 'minAmount',
      Cell: ({ value }: { value: number }) => (
        <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          ₹{value.toLocaleString()}
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
      Cell: ({ row }: { row: { original: Perk } }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingPerk(row.original)}
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
            onClick={() => setPerkToDelete(row.original.id)}
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
            Perks & Rewards
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Manage investor perks and rewards
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Perk
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
            placeholder="Search perks..."
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
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Tiers</option>
          <option value="supporter">Supporter</option>
          <option value="backer">Backer</option>
          <option value="producer">Producer</option>
          <option value="executive">Executive</option>
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

      {/* Perks Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredPerks}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>

      {/* Add/Edit Perk Modal */}
      {(isAddModalOpen || editingPerk) && (
        <PerkForm
          perk={editingPerk}
          isOpen={isAddModalOpen || !!editingPerk}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingPerk(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!perkToDelete}
        title="Delete Perk"
        message="Are you sure you want to delete this perk? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPerkToDelete(null)}
      />
    </div>
  );
};

export default PerksPanel;