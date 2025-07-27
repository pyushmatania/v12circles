import React, { useState } from 'react';
import { 
  Save, 
  Database, 
  Mail, 
  Download, 
  Upload, 
  RefreshCw,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useAdmin } from '../useAdmin';
import ConfirmDialog from '../shared/ConfirmDialog';

const SettingsPanel: React.FC = () => {
  const { theme } = useTheme();
  const { backups, createBackup, restoreBackup } = useAdmin();
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupToRestore, setBackupToRestore] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoBackup: true,
    autoBackupInterval: '7',
    securityLevel: 'high',
    maintenanceMode: false,
    debugMode: false
  });

  const handleSettingChange = (setting: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      await createBackup();
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!backupToRestore) return;
    
    setIsRestoring(true);
    try {
      await restoreBackup(backupToRestore);
    } finally {
      setIsRestoring(false);
      setBackupToRestore(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Settings
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Configure system settings and manage backups
          </p>
        </div>
        
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className={`p-6 rounded-xl ${
          theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 border border-gray-700'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            General Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Email Notifications
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Send email notifications for system events
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Maintenance Mode
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Put the system in maintenance mode
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Debug Mode
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Enable detailed error logging
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div>
              <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Security Level
              </h3>
              <select
                value={settings.securityLevel}
                onChange={(e) => handleSettingChange('securityLevel', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className={`p-6 rounded-xl ${
          theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 border border-gray-700'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Backup & Restore
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Automatic Backups
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Create backups automatically
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div>
              <h3 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Backup Interval
              </h3>
              <select
                value={settings.autoBackupInterval}
                onChange={(e) => handleSettingChange('autoBackupInterval', e.target.value)}
                disabled={!settings.autoBackup}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50`}
              >
                <option value="1">Daily</option>
                <option value="7">Weekly</option>
                <option value="30">Monthly</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-70"
              >
                {isCreatingBackup ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Create Backup
                  </>
                )}
              </button>
              <button
                className={`p-2 rounded-lg ${
                  theme === 'light' 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <h3 className={`font-medium mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Backup History
              </h3>
              <div className={`border rounded-lg overflow-hidden ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <div className={`px-4 py-3 ${
                  theme === 'light' ? 'bg-gray-50 border-b border-gray-200' : 'bg-gray-700 border-b border-gray-600'
                }`}>
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Name</div>
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Size</div>
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Date</div>
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Actions</div>
                  </div>
                </div>
                <div className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
                  {backups.map(backup => (
                    <div key={backup.id} className="px-4 py-3">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Database className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                            {backup.name}
                          </span>
                        </div>
                        <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          {formatFileSize(backup.size)}
                        </div>
                        <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          {new Date(backup.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBackupToRestore(backup.id)}
                            disabled={isRestoring}
                            className={`p-1 rounded ${
                              theme === 'light' 
                                ? 'hover:bg-gray-100 text-blue-600' 
                                : 'hover:bg-gray-700 text-blue-400'
                            } disabled:opacity-50`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            className={`p-1 rounded ${
                              theme === 'light' 
                                ? 'hover:bg-gray-100 text-gray-600' 
                                : 'hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className={`p-6 rounded-xl ${
          theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 border border-gray-700'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            System Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Version
                </p>
                <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Circles Admin v1.0.0
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Last Updated
                </p>
                <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Database Status
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className={`font-medium text-green-500`}>
                    Connected
                  </p>
                </div>
              </div>
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Storage
                </p>
                <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  1.2 GB / 10 GB
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  API Status
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className={`font-medium text-green-500`}>
                    Operational
                  </p>
                </div>
              </div>
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Cache Status
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className={`font-medium text-green-500`}>
                    Enabled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className={`p-6 rounded-xl ${
          theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 border border-gray-700'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Email Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                SMTP Server
              </label>
              <input
                type="text"
                value="smtp.circles.com"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  SMTP Port
                </label>
                <input
                  type="text"
                  value="587"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Encryption
                </label>
                <select
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                      : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                >
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Sender Email
              </label>
              <input
                type="email"
                value="noreply@circles.com"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Email Settings
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors"
                style={{
                  borderColor: theme === 'light' ? '#e2e8f0' : '#4b5563',
                  color: theme === 'light' ? '#4b5563' : '#e2e8f0',
                  backgroundColor: theme === 'light' ? 'white' : '#1f2937'
                }}
              >
                <Mail className="w-5 h-5" />
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Backup Confirmation */}
      <ConfirmDialog
        isOpen={!!backupToRestore}
        title="Restore Backup"
        message="Are you sure you want to restore this backup? This will replace all current data with the backup data."
        confirmLabel="Restore"
        confirmVariant="warning"
        onConfirm={handleRestoreBackup}
        onCancel={() => setBackupToRestore(null)}
        isLoading={isRestoring}
      />
    </div>
  );
};

export default SettingsPanel;