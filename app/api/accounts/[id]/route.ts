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
    const account = storage.getAccount(id, user.id);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(account, 'Account retrieved successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('GET /api/accounts/[id] error:', error);
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
    validators.accountId(id);
    
    // Validate and sanitize update data
    const updateData: any = {};
    
    if (body.username !== undefined) {
      updateData.username = validators.username(body.username);
    }
    
    if (body.password !== undefined) {
      updateData.password = validators.password(body.password);
    }
    
    if (body.status !== undefined) {
      updateData.status = validators.accountStatus(body.status);
    }
    
    if (body.lastActivity !== undefined) {
      updateData.lastActivity = body.lastActivity;
    }

    const updated = storage.updateAccount(id, updateData, user.id);
    if (!updated) {
      return NextResponse.json(formatErrorResponse(new Error('Account not found')), { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(updated, 'Account updated successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('PUT /api/accounts/[id] error:', error);
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
    validators.accountId(id);
    const deleted = storage.deleteAccount(id, user.id);

    if (!deleted) {
      return NextResponse.json(formatErrorResponse(new Error('Account not found')), { status: 404 });
    }

    const response = NextResponse.json(formatSuccessResponse(null, 'Account and all associated activities deleted successfully'), { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('DELETE /api/accounts/[id] error:', error);
    return NextResponse.json(formatErrorResponse(error), { status: 500 });
  }
}
