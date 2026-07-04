'use client';

import { useState, useEffect } from 'react';
import { Activity } from '@/lib/storage';
import { Download, Filter, X, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import ActivityEntry from './ActivityEntry';

interface EnhancedActivityLoggerProps {
  connectionId: string;
}

type FilterStatus = 'all' | 'pending' | 'success' | 'failed';

export default function EnhancedActivityLogger({ connectionId }: EnhancedActivityLoggerProps) {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchActivity();
    // Don't auto-refresh while selecting or deleting
    if (selectedIds.size === 0 && !deleting) {
      const interval = setInterval(fetchActivity, 2000);
      return () => clearInterval(interval);
    }
  }, [connectionId, selectedIds.size, deleting]);

  const fetchActivity = async () => {
    try {
      const res = await fetch(`/api/activity?connectionId=${connectionId}&limit=1000`);
      if (res.ok) {
        const data = await res.json();
        setActivity(data.data || data);
      }
    } catch (error) {
      console.error('[v0] Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivity = activity.filter(a => {
    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
    const searchMatch = 
      a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.details.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredActivity.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredActivity.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected activities?`)) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/activity', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      const data = await res.json();

      if (res.ok) {
        addToast(data.message || 'Activities deleted successfully', 'success');
        setSelectedIds(new Set());
        fetchActivity();
      } else {
        addToast(data.error || 'Failed to delete activities', 'error');
      }
    } catch (error) {
      console.error('[v0] Error deleting activities:', error);
      addToast('An error occurred while deleting activities', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    try {
      const csv = [
        ['Timestamp', 'Action', 'Details', 'Status'],
        ...filteredActivity.map(a => [
          new Date(a.timestamp).toLocaleString(),
          a.action,
          a.details,
          a.status,
        ]),
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-${new Date().toISOString()}.csv`;
      a.click();
      addToast('Activity exported to CSV', 'success');
    } catch (error) {
      console.error('[v0] Error exporting activity:', error);
      addToast('Failed to export activity', 'error');
    }
  };

  const exportToJSON = () => {
    try {
      const json = JSON.stringify(filteredActivity, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-${new Date().toISOString()}.json`;
      a.click();
      addToast('Activity exported to JSON', 'success');
    } catch (error) {
      console.error('[v0] Error exporting activity:', error);
      addToast('Failed to export activity', 'error');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Activity Log</h2>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={deleteSelected}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete {selectedIds.size}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredActivity.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={exportToJSON}
            disabled={filteredActivity.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            JSON
          </Button>
        </div>
      </div>

      {filteredActivity.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedIds.size === filteredActivity.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedIds.size === filteredActivity.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex gap-2 items-center flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterStatus === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('success')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterStatus === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilterStatus('failed')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterStatus === 'failed'
                ? 'bg-red-500 text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Failed
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 hover:bg-muted rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading activity...</p>
        ) : filteredActivity.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            {activity.length === 0 ? 'No activity yet' : 'No matching activities'}
          </p>
        ) : (
          filteredActivity.map(entry => (
            <div key={entry.id} className="flex items-start gap-2">
              <button
                onClick={() => toggleSelect(entry.id)}
                className="mt-2 p-1 hover:bg-muted rounded"
              >
                {selectedIds.has(entry.id) ? (
                  <CheckSquare className="w-5 h-5 text-primary" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <ActivityEntry activity={entry} />
              </div>
            </div>
          ))
        )}
      </div>

      {activity.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          Showing {filteredActivity.length} of {activity.length} entries
          {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
        </div>
      )}
    </div>
  );
}
