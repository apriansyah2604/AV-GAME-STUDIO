import { NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/midtrans';
import { fulfillRobuxOrder } from '@/lib/fulfillment';

function isPaidStatus(status: any) {
  const transactionStatus = status?.transaction_status;
  const fraudStatus = status?.fraud_status;

  if (transactionStatus === 'settlement') return true;
  if (transactionStatus === 'capture' && fraudStatus !== 'challenge') return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const { orderId, username, amount, price } = await request.json();

    if (!orderId || !username || !amount) {
      return NextResponse.json(
        { success: false, message: 'Data konfirmasi transaksi tidak lengkap.' },
        { status: 400 }
      );
    }

    const status = await getTransactionStatus(orderId);

    if (!isPaidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pembayaran belum terkonfirmasi oleh Midtrans.',
          transactionStatus: status?.transaction_status,
        },
        { status: 409 }
      );
    }

    const payoutResult = await fulfillRobuxOrder({
      orderId,
      username,
      amount: Number(amount),
      price,
      source: 'confirm',
    });

    if (!payoutResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: payoutResult.message || 'Pembayaran sukses, tetapi payout Robux gagal.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: payoutResult.alreadyProcessed ? 'Order sudah diproses.' : 'Robux berhasil dikirim.',
    });
  } catch (error: any) {
    console.error('Confirm Checkout Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengonfirmasi transaksi.' },
      { status: 500 }
    );
  }
}
