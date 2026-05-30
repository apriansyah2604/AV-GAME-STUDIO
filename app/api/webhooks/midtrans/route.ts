import { NextResponse } from 'next/server';
import { processPayout } from '@/lib/roblox';

/**
 * Webhook Midtrans untuk menangani notifikasi pembayaran.
 * POST /api/webhooks/midtrans
 */

export async function GET() {
  return NextResponse.json({ status: 'Webhook active' });
}

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Webhook received: ${orderId} - ${transactionStatus}`);

    // Logika pengiriman Robux jika pembayaran sukses
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'challenge') {
        console.warn(`Transaction ${orderId} is challenged by Midtrans.`);
      } else if (fraudStatus === 'accept' || !fraudStatus) {
        console.log(`Payment success for ${orderId}. Processing Payout...`);

        // Ambil data dari metadata yang kita kirim saat checkout
        const username = notification.metadata?.username;
        const amount = notification.metadata?.robux_amount;
        
        if (username && amount) {
          console.log(`Processing payout for ${amount} Robux to ${username}.`);
          // Jalankan payout otomatis
          const result = await processPayout(username, amount);
          console.log('Payout result:', result);
        } else {
          console.error('Metadata tidak lengkap:', notification.metadata);
        }
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'Error', message: error.message }, { status: 500 });
  }
}
