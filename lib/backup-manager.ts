'use client';

import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface BackupData {
  connections: any[];
  accounts: any[];
  activity: any[];
  timestamp: string;
  version: string;
}

export function DataBackupManager() {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportBackup = async () => {
    setIsProcessing(true);
    try {
      const [connections, accounts, activity] = await Promise.all([
        fetch('/api/connections').then(r => r.json()),
        fetch('/api/accounts').then(r => r.json()),
        fetch('/api/activity').then(r => r.json()),
      ]);

      const backup: BackupData = {
        connections: connections.data || connections,
        accounts: accounts.data || accounts,
        activity: activity.data || activity,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roblox-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      addToast('Backup exported successfully', 'success');
    } catch (error) {
      console.error('[v0] Error exporting backup:', error);
      addToast('Failed to export backup', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportBackup = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      // Validate backup structure
      if (!backup.connections || !backup.accounts || !backup.activity) {
        throw new Error('Invalid backup file format');
      }

      // Import data
      await Promise.all([
        fetch('/api/connections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ backup: backup.connections }),
        }),
        fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ backup: backup.accounts }),
        }),
        fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ backup: backup.activity }),
        }),
      ]);

      addToast(`Backup restored successfully from ${new Date(backup.timestamp).toLocaleDateString()}`, 'success');
      window.location.reload();
    } catch (error) {
      console.error('[v0] Error importing backup:', error);
      addToast(
        error instanceof Error ? error.message : 'Failed to import backup',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleExportBackup,
    handleImportBackup,
    fileInputRef,
    isProcessing,
  };
}

interface DataBackupUIProps {
  onExport: () => Promise<void>;
  onFileSelect: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export function DataBackupUI({ onExport, onFileSelect, isProcessing }: DataBackupUIProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
        className="hidden"
      />
      
      <div className="space-y-2">
        <Button
          onClick={onExport}
          disabled={isProcessing}
          variant="outline"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Backup
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Backup
        </Button>
      </div>
    </>
  );
}
