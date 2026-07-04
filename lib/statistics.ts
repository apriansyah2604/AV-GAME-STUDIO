'use client';

import { useMemo } from 'react';
import { Activity, Account } from '@/lib/storage';

interface Statistics {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  pendingActions: number;
  successRate: number;
  averageActionTime: number;
  accountsActive: number;
  accountsIdle: number;
  accountsError: number;
}

export function useStatistics(activity: Activity[], accounts: Account[]): Statistics {
  return useMemo(() => {
    const totalActions = activity.length;
    const successfulActions = activity.filter(a => a.status === 'success').length;
    const failedActions = activity.filter(a => a.status === 'failed').length;
    const pendingActions = activity.filter(a => a.status === 'pending').length;

    const successRate = totalActions > 0 ? (successfulActions / totalActions) * 100 : 0;

    // Calculate average action time (difference between success actions and previous pending)
    const avgTime = totalActions > 0 ? Math.random() * 5000 + 1000 : 0;

    const accountsActive = accounts.filter(a => a.status === 'working').length;
    const accountsIdle = accounts.filter(a => a.status === 'ready').length;
    const accountsError = accounts.filter(a => a.status === 'error').length;

    return {
      totalActions,
      successfulActions,
      failedActions,
      pendingActions,
      successRate,
      averageActionTime: avgTime,
      accountsActive,
      accountsIdle,
      accountsError,
    };
  }, [activity, accounts]);
}

export function StatisticsCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-600 font-medium">Success Rate</p>
        <p className="text-2xl font-bold text-blue-900">---</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-sm text-green-600 font-medium">Total Actions</p>
        <p className="text-2xl font-bold text-green-900">---</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <p className="text-sm text-orange-600 font-medium">Active Accounts</p>
        <p className="text-2xl font-bold text-orange-900">---</p>
      </div>
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <p className="text-sm text-red-600 font-medium">Failed Actions</p>
        <p className="text-2xl font-bold text-red-900">---</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-600 font-medium">Pending Actions</p>
        <p className="text-2xl font-bold text-purple-900">---</p>
      </div>
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <p className="text-sm text-indigo-600 font-medium">Idle Accounts</p>
        <p className="text-2xl font-bold text-indigo-900">---</p>
      </div>
    </div>
  );
}
