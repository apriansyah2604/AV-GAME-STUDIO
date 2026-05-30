import { NextResponse } from 'next/server';
import { getGroupFunds } from '@/lib/roblox';

export async function GET() {
  console.log('--- API check-funds dipanggil ---');
  try {
    const funds = await getGroupFunds();
    console.log(`Saldo berhasil diambil: ${funds} Robux`);
    return NextResponse.json({ success: true, funds });
  } catch (error: any) {
    console.error('Error detail di API check-funds:', {
      message: error.message,
      stack: error.stack,
      cookieExists: !!process.env.ROBLOX_COOKIE,
      groupId: process.env.ROBLOX_GROUP_ID
    });
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal memverifikasi stok Robux', 
        error: error.message,
        debug_info: {
          cookieConfigured: !!process.env.ROBLOX_COOKIE,
          groupId: process.env.ROBLOX_GROUP_ID
        }
      },
      { status: 500 }
    );
  }
}
