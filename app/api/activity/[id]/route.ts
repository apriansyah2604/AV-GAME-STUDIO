import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = storage.updateActivity(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/activity/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}
