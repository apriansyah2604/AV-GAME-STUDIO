import { NextResponse } from 'next/server';
import { processPayout } from '@/lib/roblox';

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

    // 3. Eksekusi Payout via VPS Server (Jika ada URL) atau Local
    const VPS_URL = process.env.ROBLOX_SERVER_URL;
    
    if (VPS_URL) {
      // Pastikan URL tidak berakhir dengan slash
      const cleanUrl = VPS_URL.endsWith('/') ? VPS_URL.slice(0, -1) : VPS_URL;
      console.log(`Mengalihkan payout ke VPS: ${cleanUrl}/api/payout`);
      try {
        const response = await fetch(`${cleanUrl}/api/payout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, amount, secret })
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (err: any) {
        console.error('Gagal menghubungi Hugging Face Server:', err.message);
        return NextResponse.json(
          { success: false, message: 'Gagal menghubungi Hugging Face Server untuk payout.' },
          { status: 502 }
        );
      }
    }

    // Fallback ke local payout jika tidak ada VPS_URL (hanya untuk testing/local)
    console.log(`Memproses payout lokal: ${amount} Robux untuk ${username}`);
    const result = await processPayout(username, amount);

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
