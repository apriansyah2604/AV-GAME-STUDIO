import { NextResponse } from 'next/server';
import { executeRobuxPayout } from '@/lib/payout';

/**
 * API Endpoint untuk memproses Payout Robux.
 * Akses: POST /api/payout
 * Body: { username: string, amount: number, secret: string }
 */

export async function POST(request: Request) {
  try {
    const { username, amount, secret } = await request.json();

    // 1. Validasi Secret Key (Keamanan Dasar)
    if (secret !== process.env.PAYOUT_SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Secret key salah.' },
        { status: 401 }
      );
    }

    // 2. Validasi Input
    if (!username || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Username dan jumlah Robux harus valid.' },
        { status: 400 }
      );
    }

    const result = await executeRobuxPayout(username, amount);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
