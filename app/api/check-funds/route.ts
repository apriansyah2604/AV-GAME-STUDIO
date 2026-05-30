import { NextResponse } from 'next/server';
import { getGroupFunds } from '@/lib/roblox';

export async function GET() {
  try {
    const funds = await getGroupFunds();
    return NextResponse.json({ success: true, funds });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil saldo grup', error: error.message },
      { status: 500 }
    );
  }
}
