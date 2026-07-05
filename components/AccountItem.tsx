'use client';

import { useState } from 'react';
import { Account } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import AccountActions from './AccountActions';

interface AccountItemProps {
  account: Account;
  onDelete: () => void;
  onActionComplete?: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export default function AccountItem({
  account,
  onDelete,
  onActionComplete,
  isSelected,
  onToggleSelect,
}: AccountItemProps) {
  const [expanded, setExpanded] = useState(false);

  if (!account) {
    return (
      <div className="border border-red-500 rounded-lg p-4 bg-red-50">
        <p className="text-red-600">Invalid account data</p>
      </div>
    );
  }

  // console.log('===== AccountItem Debug =====');
  // console.log('Full account object:', account);
  // console.log('account.id:', account.id);
  // console.log('account.username:', account.username);
  // console.log('isSelected:', isSelected);

  // Extract values with clear fallbacks
  let displayName = 'No Name';
  if (account.username && account.username.trim().length > 0) {
    displayName = account.username;
  } else if (account.id) {
    displayName = `Account (${account.id})`;
  }

  const status = account.status || 'unknown';
  const lastActivity = account.lastActivity || new Date().toISOString();

  const statusColor =
    status === 'ready' ? 'text-green-600' :
    status === 'working' ? 'text-blue-600' : 'text-red-600';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white p-4 mb-2">
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className="mt-1 p-1 hover:bg-muted rounded"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-primary" />
          ) : (
            <Square className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        <div className="flex-1">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex-1">
              {/* Nama pengguna dengan ukuran font yang jelas */}
              <p className="text-xl font-bold text-gray-900">{displayName}</p>
              <p className={`text-sm font-semibold mt-1 ${statusColor}`}>
                {status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last activity: {new Date(lastActivity).toLocaleString()}
              </p>
              {/* Menampilkan semua field untuk debug
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <pre>{JSON.stringify(account, null, 2)}</pre>
              </div> */}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {expanded && (
            <div className="border-t border-gray-200 mt-3 pt-3">
              <AccountActions
                account={account}
                onActionComplete={() => {
                  if (onActionComplete) onActionComplete();
                  setExpanded(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
