import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';
import { getAuthUser } from '@/lib/serverAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const connection = storage.getConnection(id, user.id);

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(connection, 'Connection retrieved successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('GET /api/connections/[id] error:', error);
    return NextResponse.json(formatErrorResponse(error), { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = safeJsonParse(await request.text(), {});

    // Validate ID
    validators.connectionId(id);
    
    // Validate and sanitize update data
    const updateData: any = {};
    
    if (body.name !== undefined) {
      updateData.name = validators.connectionName(body.name);
    }
    
    if (body.robloxUserId !== undefined) {
      updateData.robloxUserId = validators.robloxUserId(body.robloxUserId);
    }
    
    if (body.authToken !== undefined) {
      updateData.authToken = validators.authToken(body.authToken);
    }
    
    if (body.status !== undefined) {
      updateData.status = validators.status(body.status);
    }
    
    if (body.lastConnected !== undefined) {
      updateData.lastConnected = body.lastConnected;
    }

    const updated = storage.updateConnection(id, updateData, user.id);
    if (!updated) {
      return NextResponse.json(formatErrorResponse(new Error('Connection not found')), { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(updated, 'Connection updated successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('PUT /api/connections/[id] error:', error);
    return NextResponse.json(formatErrorResponse(error), { status: error instanceof Error && error.name === 'ValidationError' ? 400 : 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    validators.connectionId(id);
    const deleted = storage.deleteConnection(id, user.id);

    if (!deleted) {
      return NextResponse.json(formatErrorResponse(new Error('Connection not found')), { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(null, 'Connection and all associated data deleted successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('DELETE /api/connections/[id] error:', error);
    return NextResponse.json(formatErrorResponse(error), { status: 500 });
  }
}
