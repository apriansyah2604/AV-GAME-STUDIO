'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw } from 'lucide-react';

interface BotControlPanelProps {
  connectionId: string;
}

export default function BotControlPanel({ connectionId }: BotControlPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [botStatus, setBotStatus] = useState<string>('idle');

  const handleStartBot = async () => {
    try {
      const res = await fetch(`/api/bot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId }),
      });

      if (res.ok) {
        setIsRunning(true);
        setBotStatus('running');
      }
    } catch (error) {
      console.error('Error starting bot:', error);
      alert('Failed to start bot');
    }
  };

  const handleStopBot = async () => {
    try {
      const res = await fetch(`/api/bot/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId }),
      });

      if (res.ok) {
        setIsRunning(false);
        setBotStatus('stopped');
      }
    } catch (error) {
      console.error('Error stopping bot:', error);
      alert('Failed to stop bot');
    }
  };

  const handleRestartBot = async () => {
    await handleStopBot();
    setTimeout(() => handleStartBot(), 1000);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-semibold mb-4">Bot Control</h2>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Status</p>
        <p className={`text-lg font-semibold ${
          isRunning ? 'text-green-600' : 'text-gray-600'
        }`}>
          {botStatus.toUpperCase()}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleStartBot}
          disabled={isRunning}
          className="flex-1"
          variant={isRunning ? 'outline' : 'default'}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Bot
        </Button>
        <Button
          onClick={handleStopBot}
          disabled={!isRunning}
          variant="destructive"
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop Bot
        </Button>
        <Button
          onClick={handleRestartBot}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>
    </div>
  );
}
