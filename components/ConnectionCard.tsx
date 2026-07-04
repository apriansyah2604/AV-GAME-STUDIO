'use client';

import { Connection } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ConnectionCardProps {
  connection: Connection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function ConnectionCard({
  connection,
  isSelected,
  onSelect,
  onDelete,
}: ConnectionCardProps) {
  const statusColor =
    connection.status === 'connected'
      ? 'text-green-600'
      : connection.status === 'error'
        ? 'text-red-600'
        : 'text-gray-600';

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 bg-card'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-foreground">{connection.name}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-destructive/10 rounded"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        ID: {connection.robloxUserId}
      </p>
      <p className={`text-sm font-medium ${statusColor}`}>
        {connection.status.toUpperCase()}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Last: {new Date(connection.lastConnected).toLocaleDateString()}
      </p>
    </div>
  );
}
