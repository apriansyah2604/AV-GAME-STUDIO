import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/supabase-storage';
import { getAuthUser } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const connectionId = searchParams.get('connectionId');

    let activity;
    if (accountId) {
      activity = await storage.getActivityForAccount(accountId, 100, user.id);
    } else if (connectionId) {
      activity = await storage.getActivityForConnection(connectionId, 100, user.id);
    } else {
      activity = await storage.getActivityByOwner(user.id);
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('GET /api/activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, connectionId, action, details, status } = body;

    if (!accountId || !connectionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const activity = await storage.addActivity({
      ownerUserId: user.id,
      accountId,
      connectionId,
      action,
      details: details || '',
      status: status || 'pending',
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('POST /api/activity error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids' },
        { status: 400 }
      );
    }

    const deletedCount = await storage.deleteActivities(ids, user.id);

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${deletedCount} activities` 
    });
  } catch (error) {
    console.error('DELETE /api/activity error:', error);
    return NextResponse.json({ error: 'Failed to delete activities', details: String(error) }, { status: 500 });
  }
}
