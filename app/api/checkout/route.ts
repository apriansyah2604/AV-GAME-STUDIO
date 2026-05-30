import { NextResponse } from 'next/server';
import { createTransaction } from '@/lib/midtrans';

/**
 * API Endpoint untuk membuat transaksi Midtrans.
 * POST /api/checkout
 */

export async function POST(request: Request) {
  try {
    const { username, amount, packageName, price } = await request.json();

    if (!username || !amount || !price) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap.' }, { status: 400 });
    }

    const orderId = `ROBUX${amount}-${Date.now()}-${username.substring(0, 5)}`;
    
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

    // Gunakan helper createTransaction yang baru
    const transaction = await createTransaction(
      orderId, 
      price, 
      itemDetails, 
      customerDetails, 
      { username, robux_amount: amount }
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
