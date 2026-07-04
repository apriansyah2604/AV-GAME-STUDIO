'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CreateConnectionFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  robloxUserId?: string;
  authToken?: string;
}

export default function CreateConnectionForm({ onSuccess }: CreateConnectionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [robloxUserId, setRobloxUserId] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { addToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name?.trim()) {
      newErrors.name = 'Connection name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Connection name must be at least 2 characters';
    } else if (name.length > 50) {
      newErrors.name = 'Connection name must not exceed 50 characters';
    }

    if (!robloxUserId?.trim()) {
      newErrors.robloxUserId = 'Roblox User ID is required';
    } else if (!/^\d+$/.test(robloxUserId.trim())) {
      newErrors.robloxUserId = 'Roblox User ID must contain only numbers';
    }

    if (!authToken?.trim()) {
      newErrors.authToken = 'Auth Token is required';
    } else if (authToken.length < 10) {
      newErrors.authToken = 'Auth Token appears to be invalid (too short)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          robloxUserId,
          authToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setName('');
        setRobloxUserId('');
        setAuthToken('');
        setErrors({});
        setIsOpen(false);
        addToast(data.message || 'Connection created successfully', 'success');
        onSuccess();
      } else if (res.status === 409) {
        setErrors({ name: 'A connection with this name already exists' });
        addToast('A connection with this name already exists', 'error');
      } else {
        const errorMsg = data.error?.message || 'Failed to create connection';
        addToast(errorMsg, 'error');
        if (data.error?.field) {
          setErrors({ [data.error.field]: errorMsg });
        }
      }
    } catch (error) {
      console.error('[v0] Error creating connection:', error);
      addToast('An error occurred while creating the connection', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full mb-4"
        variant="default"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Connection
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg border border-border p-6 max-w-sm shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Connection</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setErrors({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Connection Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g., Bot Utama"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Roblox User ID</label>
                <input
                  type="text"
                  value={robloxUserId}
                  onChange={(e) => {
                    setRobloxUserId(e.target.value);
                    if (errors.robloxUserId) setErrors({ ...errors, robloxUserId: undefined });
                  }}
                  placeholder="e.g., 123456789"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.robloxUserId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                />
                {errors.robloxUserId && (
                  <p className="text-sm text-red-600 mt-1">{errors.robloxUserId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Auth Token</label>
                <textarea
                  value={authToken}
                  onChange={(e) => {
                    setAuthToken(e.target.value);
                    if (errors.authToken) setErrors({ ...errors, authToken: undefined });
                  }}
                  placeholder="Paste your Roblox auth token here"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 font-mono text-xs ${
                    errors.authToken
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                />
                {errors.authToken && (
                  <p className="text-sm text-red-600 mt-1">{errors.authToken}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Get this from browser console: F12 → Console → paste code
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setErrors({});
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
