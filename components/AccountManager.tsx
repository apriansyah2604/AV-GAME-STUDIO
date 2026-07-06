'use client';

import { useState } from 'react';
import { Account } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import AccountItem from './AccountItem';
import { useToast } from '@/context/ToastContext';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

interface AccountManagerProps {
  connectionId: string;
  accounts: Account[];
  onAccountsUpdate: () => void;
}

export default function AccountManager({
  connectionId,
  accounts,
  onAccountsUpdate,
}: AccountManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsername('');
        setPassword('');
        setIsAdding(false);
        addToast('Account added successfully!', 'success');
        onAccountsUpdate();
      } else {
        // Show detailed error message
        const errorMsg = data?.error?.message || data?.error || 'Failed to add account!';
        console.error('Add account error:', data);
        addToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Error adding account:', error);
      addToast('An unexpected error occurred!', 'error');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Delete this account? All associated activity will also be deleted.')) {
      try {
        const res = await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (res.ok) {
          addToast('Account deleted successfully!', 'success');
          onAccountsUpdate();
        } else {
          addToast(data.error || 'Failed to delete account!', 'error');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        addToast('An error occurred while deleting the account!', 'error');
      }
    }
  };

  const toggleSelectAll = () => {
    console.log('===== toggleSelectAll() called =====');
    console.log('Current selectedIds.size:', selectedIds.size);
    console.log('accounts.length:', accounts.length);
    
    if (selectedIds.size === accounts.length) {
      console.log('Deselecting all');
      setSelectedIds(new Set());
    } else {
      console.log('Selecting all:', accounts.map(a => ({ id: a.id, username: a.username })));
      setSelectedIds(new Set(accounts.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    console.log('===== toggleSelect() called =====');
    console.log('ID to toggle:', id);
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      console.log('Removing ID:', id);
      newSelected.delete(id);
    } else {
      console.log('Adding ID:', id);
      newSelected.add(id);
    }
    console.log('New selectedIds:', Array.from(newSelected));
    setSelectedIds(newSelected);
  };

  const deleteSelected = async () => {
    console.log('===== deleteSelected() called =====');
    console.log('selectedIds:', selectedIds);
    console.log('selectedIds.size:', selectedIds.size);
    const idsToDelete = Array.from(selectedIds);
    console.log('Array from selectedIds (sorted):', idsToDelete.sort());
    console.log('Current accounts (with IDs):', accounts.map(a => ({ id: a.id, username: a.username })));
    
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected accounts? All associated activity will also be deleted.`)) return;

    setDeleting(true);

    try {
      console.log('Sending DELETE request with ids:', idsToDelete);
      
      const res = await fetch('/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
        cache: 'no-store'
      });

      const data = await res.json();
      console.log('Response from API:', data);

      if (res.ok) {
        addToast(data.message || `${data.deletedCount || selectedIds.size} accounts deleted successfully!`, 'success');
        setSelectedIds(new Set());
        onAccountsUpdate();
      } else {
        addToast(data.error?.message || data.error || 'Failed to delete accounts!', 'error');
      }
    } catch (error) {
      console.error('Error deleting accounts:', error);
      addToast('An error occurred while deleting accounts!', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Accounts</h2>
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
      </div>

      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="mb-6 w-full">
          Add New Account
        </Button>
      ) : (
        <form onSubmit={handleAddAccount} className="mb-6 p-4 bg-muted rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="default" className="flex-1">
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAdding(false);
                setUsername('');
                setPassword('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {accounts.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedIds.size === accounts.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedIds.size === accounts.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {accounts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No accounts yet</p>
        ) : (
          accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              onDelete={() => handleDeleteAccount(account.id)}
              onActionComplete={() => onAccountsUpdate()}
              isSelected={selectedIds.has(account.id)}
              onToggleSelect={() => toggleSelect(account.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
