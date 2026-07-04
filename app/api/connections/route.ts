import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const connections = storage.getConnections();
    return NextResponse.json(
      formatSuccessResponse(connections, 'Connections fetched successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] GET /api/connections error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = safeJsonParse(await request.text(), {});
    const { name, robloxUserId, authToken } = body;

    // Validate inputs
    const validatedName = validators.connectionName(name);
    const validatedUserId = validators.robloxUserId(robloxUserId);
    const validatedToken = validators.authToken(authToken);

    // Check for duplicates
    const existingConnections = storage.getConnections();
    if (existingConnections.some(c => c.name.toLowerCase() === validatedName.toLowerCase())) {
      return NextResponse.json(
        formatErrorResponse(
          new Error('A connection with this name already exists')
        ),
        { status: 409 }
      );
    }

    const connection = storage.createConnection({
      name: validatedName,
      robloxUserId: validatedUserId,
      authToken: validatedToken,
      status: 'disconnected',
      lastConnected: new Date().toISOString(),
    });

    return NextResponse.json(
      formatSuccessResponse(connection, 'Connection created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] POST /api/connections error:', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error instanceof Error && error.message.includes('required') ? 400 : 500 }
    );
  }
}
