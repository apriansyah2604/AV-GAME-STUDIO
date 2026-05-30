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

        // Ambil data dari custom_field yang kita kirim saat checkout
        const username = notification.custom_field1;
        const amount = notification.custom_field2 ? parseInt(notification.custom_field2) : undefined;
        
        if (username && amount) {
          console.log(`Processing automatic payout for ${amount} Robux to ${username}.`);
          
          // Jalankan payout otomatis melalui API internal kita (yang sudah terhubung ke Hugging Face)
          const payoutUrl = `${new URL(request.url).origin}/api/payout`;
          
          try {
            const payoutResponse = await fetch(payoutUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: username,
                amount: amount,
                secret: process.env.PAYOUT_SECRET_KEY
              })
            });
            
            const payoutResult = await payoutResponse.json();
            console.log('Automatic Payout result:', payoutResult);
          } catch (err: any) {
            console.error('Failed to trigger automatic payout:', err.message);
          }
        } else {
          console.error('Data transaksi tidak lengkap (custom_fields kosong):', {
            username,
            amount,
            custom_field1: notification.custom_field1,
            custom_field2: notification.custom_field2
          });
        }
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'Error', message: error.message }, { status: 500 });
  }
}
