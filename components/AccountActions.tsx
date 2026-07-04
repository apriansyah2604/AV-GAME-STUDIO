'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Account } from '@/lib/storage';
import { Zap, Gift, ShoppingBag, Share2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';

interface AccountActionsProps {
  account: Account;
  onActionComplete?: () => void;
}

interface ActionConfig {
  type: string;
  label: string;
  icon: any;
  description: string;
}

export default function AccountActions({
  account,
  onActionComplete,
}: AccountActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action?: ActionConfig }>({ isOpen: false });
  const { addToast } = useToast();

  const actions: ActionConfig[] = [
    { type: 'join_game', label: 'Join Game', icon: Zap, description: 'Join a Roblox game' },
    { type: 'collect_item', label: 'Collect', icon: Gift, description: 'Collect available items' },
    { type: 'buy_item', label: 'Buy', icon: ShoppingBag, description: 'Purchase items' },
    { type: 'trade_item', label: 'Trade', icon: Share2, description: 'Trade with players' },
  ];

  const executeAction = async (actionType: string) => {
    setLoading(actionType);
    setConfirmDialog({ isOpen: false });

    try {
      const res = await fetch('/api/bot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: account.connectionId,
          accountId: account.id,
          action: actionType,
          details: `Account: ${account.username}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast(`Action executed successfully for ${account.username}`, 'success');
        if (onActionComplete) {
          onActionComplete();
        }
      } else {
        const errorMsg = data.error?.message || 'Failed to execute action';
        addToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('[v0] Error executing action:', error);
      addToast('An error occurred while executing the action', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleActionClick = (action: ActionConfig) => {
    setConfirmDialog({ isOpen: true, action });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.type}
              size="sm"
              variant="outline"
              disabled={loading !== null || account.status !== 'ready'}
              onClick={() => handleActionClick(action)}
              title={action.description}
            >
              <IconComponent className="w-4 h-4 mr-1" />
              {action.label}
            </Button>
          );
        })}
      </div>

      {confirmDialog.action && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={`Execute ${confirmDialog.action.label}?`}
          message={`Are you sure you want to ${confirmDialog.action.label.toLowerCase()} for account "${account.username}"? This action will be logged.`}
          confirmText={`Execute ${confirmDialog.action.label}`}
          cancelText="Cancel"
          onConfirm={() => executeAction(confirmDialog.action!.type)}
          onCancel={() => setConfirmDialog({ isOpen: false })}
          isLoading={loading === confirmDialog.action.type}
        />
      )}
    </>
  );
}
