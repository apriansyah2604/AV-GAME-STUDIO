import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectionId } = body;

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Missing connectionId' },
        { status: 400 }
      );
    }

    // Update connection status
    const updated = storage.updateConnection(connectionId, {
      status: 'connected',
      lastConnected: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Simulate bot startup
    const accounts = storage.getAccountsByConnection(connectionId);
    accounts.forEach(account => {
      storage.updateAccount(account.id, { status: 'ready' });
      storage.addActivity({
        accountId: account.id,
        connectionId,
        action: 'Bot Started',
        details: `Bot process initialized for ${account.username}`,
        status: 'success',
      });
    });

    return NextResponse.json({ success: true, message: 'Bot started' });
  } catch (error) {
    console.error('POST /api/bot/start error:', error);
    return NextResponse.json({ error: 'Failed to start bot' }, { status: 500 });
  }
}
