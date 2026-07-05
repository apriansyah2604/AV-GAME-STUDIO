'use client';

import { useState, useEffect } from 'react';
import { Connection, Account } from '@/lib/storage';
import ConnectionCard from './ConnectionCard';
import AccountManager from './AccountManager';
import ActivityLogger from './ActivityLogger';
import EnhancedActivityLogger from './EnhancedActivityLogger';
import BotControlPanel from './BotControlPanel';
import CreateConnectionForm from './CreateConnectionForm';
import BotStatistics from './BotStatistics';
import { SettingsPanel } from './SettingsPanel';
import FriendsPanel from './FriendsPanel';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';
import { Settings } from 'lucide-react';

export default function Dashboard() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id?: string; name?: string }>({ isOpen: false });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchConnections();
    const interval = setInterval(fetchConnections, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConnection) {
      fetchAccounts(selectedConnection);
    }
  }, [selectedConnection]);

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setConnections(data.data || data);
      }
    } catch (error) {
      console.error('[v0] Error fetching connections:', error);
      addToast('Failed to fetch connections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/accounts?connectionId=${connectionId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        console.log('[Dashboard.fetchAccounts] Response from API:', data);
        console.log('[Dashboard.fetchAccounts] Using data.data || data:', data.data || data);
        const accounts = data.data || data;
        console.log('[Dashboard.fetchAccounts] Setting accounts:', accounts);
        setAccounts(accounts);
      }
    } catch (error) {
      console.error('[v0] Error fetching accounts:', error);
      addToast('Failed to fetch accounts', 'error');
    }
  };

  const handleDeleteConnection = async (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/connections/${deleteConfirm.id}`, { method: 'DELETE' });
      if (res.ok) {
        setConnections(connections.filter(c => c.id !== deleteConfirm.id));
        if (selectedConnection === deleteConfirm.id) {
          setSelectedConnection(null);
        }
        addToast(`Connection "${deleteConfirm.name}" deleted successfully`, 'success');
      } else {
        addToast('Failed to delete connection', 'error');
      }
    } catch (error) {
      console.error('[v0] Error deleting connection:', error);
      addToast('An error occurred while deleting the connection', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm({ isOpen: false });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Roblox Account Manager</h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 hover:bg-muted rounded-lg"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connections Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4">Connections</h2>
              <CreateConnectionForm onSuccess={fetchConnections} />
              <div className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : connections.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No connections yet</p>
                ) : (
                  connections.map(conn => (
                    <ConnectionCard
                      key={conn.id}
                      connection={conn}
                      isSelected={selectedConnection === conn.id}
                      onSelect={() => setSelectedConnection(conn.id)}
                      onDelete={() => handleDeleteConnection(conn.id, conn.name)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {selectedConnection ? (
              <>
                <BotStatistics connectionId={selectedConnection} accounts={accounts} />
                <BotControlPanel connectionId={selectedConnection} />
                <AccountManager 
                  connectionId={selectedConnection} 
                  accounts={accounts}
                  onAccountsUpdate={() => fetchAccounts(selectedConnection)}
                />
                <FriendsPanel connectionId={selectedConnection} />
                <EnhancedActivityLogger connectionId={selectedConnection} />
              </>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-muted-foreground">Select a connection to manage accounts and activities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Connection?"
        message={`Are you sure you want to delete the connection "${deleteConfirm.name}"? All associated accounts and activities will be permanently deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
        isDestructive
        isLoading={deleteLoading}
      />

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
