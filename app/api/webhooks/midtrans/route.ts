import { NextResponse } from 'next/server';
import { fulfillRobuxOrder } from '@/lib/fulfillment';
import { getTransactionStatus } from '@/lib/midtrans';
import { confirmPartnerOrder } from '@/lib/partner-orders';

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
    if (typeof orderId !== 'string' || !orderId) {
      return NextResponse.json({ status: 'Invalid notification' }, { status: 400 });
    }

    const status = await getTransactionStatus(orderId);
    const paid = status.transaction_status === 'settlement'
      || (status.transaction_status === 'capture' && status.fraud_status !== 'challenge');

    if (paid) {
      if (orderId.startsWith('PARTNER-')) {
        const result = await confirmPartnerOrder(orderId, Number(status.gross_amount));
        if (!result.success) {
          console.error(`Webhook could not confirm partner order ${orderId}:`, result.message);
          return NextResponse.json({ status: 'Could not process partner order' }, { status: 500 });
        }
        return NextResponse.json({ status: 'OK' });
      }

      const result = await fulfillRobuxOrder({
        orderId,
        paidAmount: Number(status.gross_amount),
        source: 'webhook',
      });
      if (!result.success) {
        console.error(`Webhook could not process paid order ${orderId}:`, result.message);
        return NextResponse.json({ status: 'Could not process order' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'Error', message: error.message }, { status: 500 });
  }
}
