import { NextResponse } from 'next/server';
import { fulfillRobuxOrder } from '@/lib/fulfillment';
import { getTransactionStatus } from '@/lib/midtrans';

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
        let username = notification.custom_field1;
        let amount = notification.custom_field2 ? parseInt(notification.custom_field2) : undefined;
        
        // Fallback: Jika custom_fields kosong di notification, coba ambil dari API Midtrans langsung
        if (!username || !amount) {
          console.log(`Custom fields missing in webhook for ${orderId}, fetching from Midtrans API...`);
          const status = await getTransactionStatus(orderId);
          username = status.custom_field1;
          amount = status.custom_field2 ? parseInt(status.custom_field2) : undefined;
        }
        
        if (username && amount) {
          console.log(`Processing automatic payout for ${amount} Robux to ${username}.`);
          const payoutResult = await fulfillRobuxOrder({
            orderId,
            username,
            amount,
            price: notification.gross_amount,
            source: 'webhook',
          });
          console.log('Payout result:', payoutResult);
        } else {
          console.error('Data transaksi tidak lengkap bahkan setelah fallback API:', {
            username,
            amount
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
