import { NextResponse } from 'next/server';
import { createTransaction } from '@/lib/midtrans';
import { supabase } from '@/lib/supabase';

const packagePrices: Record<number, number> = {
  10: 1000,
  100: 15000,
  300: 50000,
  1000: 150000,
  2000: 290000,
};

/**
 * API Endpoint untuk membuat transaksi Midtrans.
 * POST /api/checkout
 */

export async function POST(request: Request) {
  try {
    const { username: submittedUsername, amount } = await request.json();
    const username = typeof submittedUsername === 'string' ? submittedUsername.trim() : '';
    const price = packagePrices[amount];

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username) || !Number.isInteger(amount) || !price) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap.' }, { status: 400 });
    }

    const packageName = `${amount} Robux`;
    const orderId = `ROBUX${amount}-${crypto.randomUUID()}`;
    
    // 1. Simpan pesanan ke Supabase sebagai 'pending' sebelum memanggil Midtrans
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      username,
      package: packageName,
      price,
      status: 'pending',
      proof: 'MIDTRANS (INIT)'
    });

    if (orderError) throw orderError;

    const itemDetails = [
      {
        id: `ITEM-${amount}`,
        price: price,
        quantity: 1,
        name: `${packageName} for ${username}`
      }
    ];

    const customerDetails = {
      first_name: username,
      email: `${username}@roblox.user`, // Email dummy karena Midtrans butuh email
      phone: '08123456789'
    };

    // 2. Gunakan helper createTransaction yang baru
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const baseUrl = origin ? new URL(origin).origin : '';
    const redirectUrl = baseUrl ? `${baseUrl}/topup?order_id=${orderId}&status=paid` : undefined;

    const transaction = await createTransaction(
      orderId, 
      price, 
      itemDetails, 
      customerDetails, 
      { username, robux_amount: amount },
      redirectUrl
    );

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
