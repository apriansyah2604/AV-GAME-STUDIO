'use client';

import { useEffect, useState } from 'react';
import { Activity, Account } from '@/lib/storage';
import { BarChart3 } from 'lucide-react';

interface BotStatisticsProps {
  connectionId: string;
  accounts: Account[];
}

interface Stats {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  pendingActions: number;
  successRate: string;
  activeAccounts: number;
  readyAccounts: number;
  errorAccounts: number;
}

export default function BotStatistics({ connectionId, accounts }: BotStatisticsProps) {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalActions: 0,
    successfulActions: 0,
    failedActions: 0,
    pendingActions: 0,
    successRate: '0%',
    activeAccounts: 0,
    readyAccounts: 0,
    errorAccounts: 0,
  });

  useEffect(() => {
    fetchActivityAndCalculateStats();
  }, [connectionId, accounts]);

  const fetchActivityAndCalculateStats = async () => {
    try {
      const res = await fetch(`/api/activity/${connectionId}`);
      if (res.ok) {
        const data = await res.json();
        const activities = data.data || data;
        setActivity(activities);

        // Calculate statistics
        const total = activities.length;
        const successful = activities.filter((a: Activity) => a.status === 'success').length;
        const failed = activities.filter((a: Activity) => a.status === 'failed').length;
        const pending = activities.filter((a: Activity) => a.status === 'pending').length;
        const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0';

        const active = accounts.filter(a => a.status === 'working').length;
        const ready = accounts.filter(a => a.status === 'ready').length;
        const error = accounts.filter(a => a.status === 'error').length;

        setStats({
          totalActions: total,
          successfulActions: successful,
          failedActions: failed,
          pendingActions: pending,
          successRate: `${successRate}%`,
          activeAccounts: active,
          readyAccounts: ready,
          errorAccounts: error,
        });
      }
    } catch (error) {
      console.error('[v0] Error fetching activity for stats:', error);
    }
  };

  const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div className={`${color} rounded-lg p-4 border`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" />
        <h2 className="text-2xl font-semibold">Bot Statistics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Success Rate" value={stats.successRate} color="bg-green-50 border-green-200" />
        <StatCard label="Total Actions" value={stats.totalActions} color="bg-blue-50 border-blue-200" />
        <StatCard label="Successful" value={stats.successfulActions} color="bg-emerald-50 border-emerald-200" />
        <StatCard label="Failed" value={stats.failedActions} color="bg-red-50 border-red-200" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Pending" value={stats.pendingActions} color="bg-orange-50 border-orange-200" />
        <StatCard label="Active Accounts" value={stats.activeAccounts} color="bg-purple-50 border-purple-200" />
        <StatCard label="Ready Accounts" value={stats.readyAccounts} color="bg-indigo-50 border-indigo-200" />
        <StatCard label="Error Accounts" value={stats.errorAccounts} color="bg-rose-50 border-rose-200" />
      </div>

      <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
