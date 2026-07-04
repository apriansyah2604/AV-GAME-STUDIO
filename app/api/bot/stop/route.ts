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
      status: 'disconnected',
    });

    if (!updated) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Stop bot for all accounts
    const accounts = storage.getAccountsByConnection(connectionId);
    accounts.forEach(account => {
      storage.updateAccount(account.id, { status: 'ready' });
      storage.addActivity({
        accountId: account.id,
        connectionId,
        action: 'Bot Stopped',
        details: `Bot process stopped for ${account.username}`,
        status: 'success',
      });
    });

    return NextResponse.json({ success: true, message: 'Bot stopped' });
  } catch (error) {
    console.error('POST /api/bot/stop error:', error);
    return NextResponse.json({ error: 'Failed to stop bot' }, { status: 500 });
  }
}
