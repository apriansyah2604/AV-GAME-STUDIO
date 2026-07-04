import { useEffect, useState, useCallback } from 'react';
import { Connection, Account, Activity } from '@/lib/storage';

interface RealtimeUpdate {
  connections: Connection[];
  accounts: Account[];
  activities: Activity[];
  timestamp: string;
}

export function useRealtimeUpdates(connectionId?: string) {
  const [updates, setUpdates] = useState<RealtimeUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUpdates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (connectionId) {
        params.append('connectionId', connectionId);
      }

      const res = await fetch(`/api/realtime?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUpdates(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching real-time updates:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  useEffect(() => {
    // Initial fetch
    fetchUpdates();

    // Set up polling interval - update every 2 seconds
    const interval = setInterval(fetchUpdates, 2000);

    return () => clearInterval(interval);
  }, [fetchUpdates]);

  return { updates, loading, error, refetch: fetchUpdates };
}
