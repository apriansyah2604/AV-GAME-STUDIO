import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/supabase-storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';
import { getAuthUser } from '@/lib/serverAuth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await storage.getConnectionsByOwner(user.id);
    const response = NextResponse.json(
      formatSuccessResponse(connections, 'Connections retrieved successfully'),
      { status: 200 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('GET /api/connections error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = safeJsonParse(await request.text(), {});
    
    // Validate required fields
    validators.connectionName(body.name);
    validators.robloxUserId(body.robloxUserId);
    validators.authToken(body.authToken);

    const connection = await storage.createConnection({
      ownerUserId: user.id,
      name: body.name,
      robloxUserId: body.robloxUserId,
      authToken: body.authToken,
      status: 'disconnected',
      lastConnected: new Date().toISOString(),
    });

    const response = NextResponse.json(
      formatSuccessResponse(connection, 'Connection created successfully'),
      { status: 201 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('POST /api/connections error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error instanceof Error && error.name === 'ValidationError' ? 400 : 500 }
    );
  }
}
