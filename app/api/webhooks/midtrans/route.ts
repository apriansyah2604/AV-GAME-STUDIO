import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
        
        // --- CATAT/UPDATE PESANAN KE SUPABASE ---
        try {
          const { error } = await supabase
            .from('orders')
            .upsert({
              id: orderId,
              username,
              package: `${amount} Robux`,
              price: `Rp ${notification.gross_amount}`,
              status: 'completed',
              proof: 'PAID VIA MIDTRANS'
            });
            
          if (error) throw error;
        } catch (err) {
          console.error('Failed to update Supabase in webhook:', err);
        }
        // ------------------------------------

        if (username && amount) {
          console.log(`Processing automatic payout for ${amount} Robux to ${username}.`);
          
          const botUrl = process.env.ROBLOX_SERVER_URL;
          const secret = process.env.PAYOUT_SECRET_KEY;
          
          if (!botUrl || !secret) {
            console.error('Missing Bot URL or Secret in Environment Variables!');
            return NextResponse.json({ status: 'Error', message: 'Config missing' }, { status: 500 });
          }

          const cleanBotUrl = botUrl.endsWith('/') ? botUrl.slice(0, -1) : botUrl;
          
          try {
            const payoutResponse = await fetch(`${cleanBotUrl}/api/payout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: username,
                amount: amount,
                secret: secret
              })
            });
            
            const payoutResult = await payoutResponse.json();
            console.log('Bot Response:', payoutResult);
          } catch (err: any) {
            console.error('Failed to contact Hugging Face Bot:', err.message);
          }
        } else {
          console.error('Data transaksi tidak lengkap (custom_fields kosong):', {
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
