import { supabase } from '@/lib/supabase';

type FulfillOrderInput = {
  orderId: string;
  paidAmount: number;
  source: string;
};

export async function fulfillRobuxOrder({ orderId, paidAmount, source }: FulfillOrderInput) {
  if (!orderId || !Number.isFinite(paidAmount) || paidAmount <= 0) {
    return {
      success: false,
      message: 'Data transaksi tidak lengkap untuk memproses pesanan.',
    };
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('username, package, price, status')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) {
    return { success: false, message: 'Pesanan tidak ditemukan.' };
  }

  if (Number(order.price) !== paidAmount) {
    return { success: false, message: 'Nominal pembayaran tidak cocok dengan pesanan.' };
  }

  if (order.status === 'manual_payout') {
    return {
      success: true,
      manual: true,
      alreadyProcessed: true,
      message: 'Pembayaran sudah tercatat. Silakan chat seller untuk proses manual.',
    };
  }

  if (order.status === 'completed') {
    return {
      success: true,
      manual: false,
      alreadyProcessed: true,
      message: 'Pesanan sudah selesai.',
    };
  }

  if (!order.username || !/^\d+\s+Robux$/i.test(order.package || '')) {
    return { success: false, message: 'Data pesanan tidak valid.' };
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'manual_payout',
      proof: `PAID VIA MIDTRANS (${source}) - WAITING FOR SELLER`,
    })
    .eq('id', orderId)
    .in('status', ['pending', 'payout_failed'])
    .select('id')
    .maybeSingle();

  if (updateError) throw updateError;

  if (!updatedOrder) {
    const { data: currentOrder, error: currentOrderError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .maybeSingle();

    if (currentOrderError) throw currentOrderError;
    if (currentOrder?.status === 'manual_payout') {
      return {
        success: true,
        manual: true,
        alreadyProcessed: true,
        message: 'Pembayaran sudah tercatat. Silakan chat seller untuk proses manual.',
      };
    }

    return { success: false, message: 'Pesanan tidak dapat diproses saat ini.' };
  }

  return {
    success: true,
    manual: true,
    username: order.username,
    amount: Number(order.package.match(/^\d+/)?.[0]),
    message: 'Pembayaran terverifikasi. Silakan chat seller untuk proses manual.',
  };
}
