'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsProps) {
  const [pollingInterval, setPollingInterval] = useState(2);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [maxActivityEntries, setMaxActivityEntries] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setPollingInterval(settings.pollingInterval || 2);
      setAutoRefresh(settings.autoRefresh !== false);
      setMaxActivityEntries(settings.maxActivityEntries || 100);
      setDarkMode(settings.darkMode || false);
    }
  }, [isOpen]);

  const handleSave = () => {
    const settings = {
      pollingInterval,
      autoRefresh,
      maxActivityEntries,
      darkMode,
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    addToast('Settings saved successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    setPollingInterval(2);
    setAutoRefresh(true);
    setMaxActivityEntries(100);
    setDarkMode(false);
    localStorage.removeItem('appSettings');
    addToast('Settings reset to defaults', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg border border-border p-6 max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Polling Interval */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Polling Interval (seconds)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={pollingInterval}
              onChange={(e) => setPollingInterval(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {pollingInterval}s - How often to refresh activity logs
            </p>
          </div>

          {/* Auto Refresh */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium">Auto-refresh activity logs</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically fetch new activities at the specified interval
            </p>
          </div>

          {/* Max Activity Entries */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Max Activity Entries
            </label>
            <select
              value={maxActivityEntries}
              onChange={(e) => setMaxActivityEntries(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
              <option value={200}>200 entries</option>
              <option value={500}>500 entries</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum number of activity entries to display
            </p>
          </div>

          {/* Dark Mode */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium">Dark mode (experimental)</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Enable dark theme for the application
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
