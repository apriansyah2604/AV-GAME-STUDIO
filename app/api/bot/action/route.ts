import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectionId, accountId, action, details } = body;

    if (!connectionId || !accountId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create activity record
    const activity = storage.addActivity({
      accountId,
      connectionId,
      action,
      details: details || '',
      status: 'success',
    });

    // Update account last activity
    storage.updateAccount(accountId, {
      lastActivity: new Date().toISOString(),
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('POST /api/bot/action error:', error);
    return NextResponse.json({ error: 'Failed to execute action' }, { status: 500 });
  }
}
