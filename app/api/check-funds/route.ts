import { NextResponse } from 'next/server';
import { getGroupFunds } from '@/lib/roblox';

let cachedFunds: number | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // Cache selama 30 detik

export async function GET() {
  console.log('--- API check-funds dipanggil ---');
  
  // Gunakan cache jika masih valid untuk menghemat request ke Roblox
  const now = Date.now();
  if (cachedFunds !== null && (now - lastFetchTime < CACHE_DURATION)) {
    console.log(`Menggunakan cache saldo: ${cachedFunds} Robux`);
    return NextResponse.json({ success: true, funds: cachedFunds, cached: true });
  }

  try {
    // 1. Coba ambil dari VPS Server jika tersedia
    const VPS_URL = process.env.ROBLOX_SERVER_URL;
    if (VPS_URL) {
      console.log(`Mengambil saldo dari VPS: ${VPS_URL}/api/funds`);
      try {
        const response = await fetch(`${VPS_URL}/api/funds`);
        const data = await response.json();
        if (data.success) {
          cachedFunds = data.funds;
          lastFetchTime = now;
          return NextResponse.json({ success: true, funds: data.funds, from: 'vps' });
        }
      } catch (e) {
        console.warn('Gagal menghubungi VPS untuk cek saldo, menggunakan fallback lokal.');
      }
    }

    const funds = await getGroupFunds();
    cachedFunds = funds;
    lastFetchTime = now;
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
