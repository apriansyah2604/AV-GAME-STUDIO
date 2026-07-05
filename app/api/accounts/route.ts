import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';
import { getAuthUser } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');

    let accounts = storage.getAccounts();
    
    if (connectionId) {
      // Don't validate connectionId for GET requests - just filter
      accounts = accounts.filter(a => a.connectionId === connectionId);
    }

    const response = NextResponse.json(
      formatSuccessResponse(accounts, 'Accounts retrieved successfully'),
      { status: 200 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('GET /api/accounts error:', error);
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
    validators.connectionId(body.connectionId);
    validators.username(body.username);
    validators.password(body.password);

    const account = storage.createAccount({
      connectionId: body.connectionId,
      username: body.username,
      password: body.password,
      status: 'ready',
      lastActivity: new Date().toISOString(),
    });

    const response = NextResponse.json(
      formatSuccessResponse(account, 'Account created successfully'),
      { status: 201 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('POST /api/accounts error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error instanceof Error && error.name === 'ValidationError' ? 400 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = safeJsonParse(await request.text(), {});
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        formatErrorResponse(new Error('Missing or invalid ids array')),
        { status: 400 }
      );
    }

    const deletedCount = storage.deleteAccounts(ids);
    
    const response = NextResponse.json(
      formatSuccessResponse({ deletedCount }, `Successfully deleted ${deletedCount} account(s)`),
      { status: 200 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('DELETE /api/accounts error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: 500 }
    );
  }
}
