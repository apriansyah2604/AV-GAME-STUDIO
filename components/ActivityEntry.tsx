'use client';

import { Activity } from '@/lib/storage';

interface ActivityEntryProps {
  activity: Activity;
}

export default function ActivityEntry({ activity }: ActivityEntryProps) {
  const statusColor =
    activity.status === 'success'
      ? 'text-green-600'
      : activity.status === 'pending'
        ? 'text-blue-600'
        : 'text-red-600';

  const bgColor =
    activity.status === 'success'
      ? 'bg-green-50 dark:bg-green-950'
      : activity.status === 'pending'
        ? 'bg-blue-50 dark:bg-blue-950'
        : 'bg-red-50 dark:bg-red-950';

  return (
    <div className={`p-3 rounded-lg border border-border ${bgColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-foreground">{activity.action}</p>
          {activity.details && (
            <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(activity.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <span className={`text-sm font-semibold ${statusColor}`}>
          {activity.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
