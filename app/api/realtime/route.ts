import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');
    const since = searchParams.get('since');

    const connections = storage.getConnections();
    const accounts = storage.getAccounts();
    const activities = storage.getActivity();

    const updates = {
      connections: connectionId
        ? connections.filter(c => c.id === connectionId)
        : connections,
      accounts: connectionId
        ? accounts.filter(a => a.connectionId === connectionId)
        : accounts,
      activities: connectionId
        ? activities.filter(a => a.connectionId === connectionId)
        : activities,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(updates);
  } catch (error) {
    console.error('GET /api/realtime error:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
