import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar,
  User,
  Activity,
  Film,
  ShoppingBag,
  Gift,
  Image,
  Settings,
  Download,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import type { ActivityLog } from '../AdminContextTypes';
import DataTable from '../shared/DataTable';

const ActivityLogPanel: React.FC = () => {
  const { theme } = useTheme();
  const { activityLogs } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResourceType, setFilterResourceType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof ActivityLog>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  // Get unique users for filter
  const users = useMemo(() => {
    const uniqueUsers = new Map();
    activityLogs.forEach(log => {
      if (log.userId && log.userName) {
        uniqueUsers.set(log.userId, log.userName);
      }
    });
    return Array.from(uniqueUsers.entries()).map(([id, name]) => ({ id, name }));
  }, [activityLogs]);

  // Filter and sort activity logs
  const filteredLogs = useMemo(() => {
    return activityLogs
      .filter(log => {
        // Search term filter
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Resource type filter
        const matchesResourceType = filterResourceType === 'all' || log.resourceType === filterResourceType;
        
        // User filter
        const matchesUser = filterUser === 'all' || log.userId === filterUser;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange.start) {
          const startDate = new Date(dateRange.start);
          const logDate = new Date(log.timestamp);
          matchesDateRange = matchesDateRange && logDate >= startDate;
        }
        if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999); // End of day
          const logDate = new Date(log.timestamp);
          matchesDateRange = matchesDateRange && logDate <= endDate;
        }
        
        return matchesSearch && matchesResourceType && matchesUser && matchesDateRange;
      })
      .sort((a, b) => {
        // Handle date fields
        if (sortField === 'timestamp') {
          return sortDirection === 'asc'
            ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
            : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
        }
        
        // Handle string fields
        return sortDirection === 'asc'
          ? String(a[sortField]).localeCompare(String(b[sortField]))
          : String(b[sortField]).localeCompare(String(a[sortField]));
      });
  }, [activityLogs, searchTerm, filterResourceType, filterUser, dateRange, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof ActivityLog);
      setSortDirection('asc');
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Film className="w-4 h-4 text-purple-500" />;
      case 'merchandise':
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'perk':
        return <Gift className="w-4 h-4 text-yellow-500" />;
      case 'media':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'user':
        return <User className="w-4 h-4 text-orange-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const columns = [
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }: { row: { original: ActivityLog } }) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
          }`}>
            {getResourceTypeIcon(row.original.resourceType)}
          </div>
          <div>
            <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {row.original.action}
            </p>
            {row.original.details && (
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {row.original.details}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      Header: 'User',
      accessor: 'userName',
      Cell: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <User className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
            {value || 'System'}
          </span>
        </div>
      )
    },
    {
      Header: 'Resource Type',
      accessor: 'resourceType',
      Cell: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          {getResourceTypeIcon(value)}
          <span className={`capitalize ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp',
      Cell: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            {formatTimestamp(value)}
          </span>
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
            Activity Log
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Track all system activities and changes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search activities..."
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
          value={filterResourceType}
          onChange={(e) => setFilterResourceType(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Resource Types</option>
          <option value="project">Projects</option>
          <option value="merchandise">Merchandise</option>
          <option value="perk">Perks</option>
          <option value="media">Media</option>
          <option value="user">Users</option>
          <option value="system">System</option>
        </select>

        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'light'
              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
              : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        >
          <option value="all">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                  : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>
          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>to</span>
          <div className="relative flex-1">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'light'
                  ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                  : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredLogs}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  );
};

export default ActivityLogPanel;