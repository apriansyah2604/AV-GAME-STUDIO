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

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      item_details: itemDetails,
      customer_details: customerDetails,
      metadata: {
        username: username,
        robux_amount: amount
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // Menambahkan pembatasan metode pembayaran jika diinginkan
    // Di sini kita bisa menambahkan parameter enabled_payments
    
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
