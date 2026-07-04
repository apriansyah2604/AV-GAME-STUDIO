'use client';

import { useState, useEffect } from 'react';
import { Activity } from '@/lib/storage';
import ActivityEntry from './ActivityEntry';

interface ActivityLoggerProps {
  connectionId: string;
}

export default function ActivityLogger({ connectionId }: ActivityLoggerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 3000);
    return () => clearInterval(interval);
  }, [connectionId]);

  const fetchActivity = async () => {
    try {
      const res = await fetch(`/api/activity?connectionId=${connectionId}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-semibold mb-4">Activity Log</h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activities yet</p>
        ) : (
          activities.map((activity) => (
            <ActivityEntry key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}
