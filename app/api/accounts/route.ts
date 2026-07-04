import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    console.log('===== GET /api/accounts =====');
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');

    let accounts = storage.getAccounts();
    console.log('[GET /api/accounts] Total accounts in storage:', accounts.length);
    
    if (connectionId) {
      // Don't validate connectionId for GET requests - just filter
      accounts = accounts.filter(a => a.connectionId === connectionId);
      console.log('[GET /api/accounts] Filtered for connection:', connectionId, 'Found:', accounts.length, 'accounts');
    }

    // Sanitize accounts, but don't generate new ID!
    const sanitizedAccounts = accounts.map(account => ({
      id: account.id,
      connectionId: account.connectionId,
      username: account.username || 'Unknown User',
      password: account.password || '',
      status: account.status || 'ready',
      lastActivity: account.lastActivity || new Date().toISOString(),
      createdAt: account.createdAt || new Date().toISOString(),
    }));

    console.log('[GET /api/accounts] Returning accounts with IDs:', sanitizedAccounts.map(a => a.id));

    return NextResponse.json(
      formatSuccessResponse(sanitizedAccounts, 'Accounts fetched successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] GET /api/accounts error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = safeJsonParse(await request.text(), {});
    const { connectionId, username, password } = body;

    // Validate inputs
    const validatedConnectionId = validators.connectionId(connectionId);
    const validatedUsername = validators.username(username);
    const validatedPassword = validators.password(password);

    // Verify connection exists
    const connection = storage.getConnection(validatedConnectionId);
    if (!connection) {
      return NextResponse.json(
        formatErrorResponse(new Error('Connection not found')),
        { status: 404 }
      );
    }

    // Check for duplicates in this connection
    const existingAccounts = storage.getAccountsByConnection(validatedConnectionId);
    if (existingAccounts.some(a => a.username.toLowerCase() === validatedUsername.toLowerCase())) {
      return NextResponse.json(
        formatErrorResponse(new Error('Account with this username already exists in this connection')),
        { status: 409 }
      );
    }

    const account = storage.createAccount({
      connectionId: validatedConnectionId,
      username: validatedUsername,
      password: validatedPassword,
      status: 'ready',
      lastActivity: new Date().toISOString(),
    });

    return NextResponse.json(
      formatSuccessResponse(account, 'Account created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] POST /api/accounts error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error instanceof Error && error.message.includes('required') ? 400 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('===== DELETE /api/accounts =====');
    const body = safeJsonParse(await request.text(), {});
    const { ids } = body;

    console.log('Received IDs to delete:', ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        formatErrorResponse(new Error('Missing or invalid ids array')),
        { status: 400 }
      );
    }

    // Log current accounts before delete
    const rawAccountsBefore = require('../../../data/accounts.json');
    console.log('Accounts before delete:', rawAccountsBefore);

    const deletedCount = storage.deleteAccounts(ids);
    
    // Log current accounts after delete
    const rawAccountsAfter = require('../../../data/accounts.json');
    console.log('Accounts after delete:', rawAccountsAfter);

    console.log(`Deleted ${deletedCount} accounts`);

    return NextResponse.json(
      formatSuccessResponse({ deletedCount }, `Successfully deleted ${deletedCount} account(s)`),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] DELETE /api/accounts error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: 500 }
    );
  }
}
