import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/supabase-storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';
import { getAuthUser } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    console.log('GET /api/accounts - User:', user);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');
    console.log('GET /api/accounts - connectionId:', connectionId);

    let accounts;
    if (connectionId) {
      accounts = await storage.getAccountsByConnection(connectionId, user.id);
    } else {
      accounts = await storage.getAccountsByOwner(user.id);
    }
    console.log('GET /api/accounts - Found accounts:', accounts.length);

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
    console.log('POST /api/accounts - User:', user);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = safeJsonParse(await request.text(), {});
    console.log('POST /api/accounts - Request body:', body);
    
    // Validate required fields
    validators.connectionId(body.connectionId);
    validators.username(body.username);
    validators.password(body.password);

    console.log('POST /api/accounts - Creating account...');
    const account = await storage.createAccount({
      ownerUserId: user.id,
      connectionId: body.connectionId,
      username: body.username,
      password: body.password,
      status: 'ready',
      lastActivity: new Date().toISOString(),
    });
    console.log('POST /api/accounts - Account created:', account);

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

    const deletedCount = await storage.deleteAccounts(ids, user.id);
    
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
