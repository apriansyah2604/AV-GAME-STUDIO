import { supabase } from '@/lib/supabase';
import { executeRobuxPayout } from '@/lib/payout';

type FulfillOrderInput = {
  orderId: string;
  username: string;
  amount: number;
  price?: string | number;
  source: string;
};

export async function fulfillRobuxOrder({ orderId, username, amount, price, source }: FulfillOrderInput) {
  if (!orderId || !username || !amount || amount <= 0) {
    return {
      success: false,
      message: 'Data transaksi tidak lengkap untuk payout Robux.',
    };
  }

  try {
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('status, proof')
      .eq('id', orderId)
      .maybeSingle();

    if (existingOrder?.status === 'completed' && String(existingOrder?.proof || '').startsWith('PAID VIA MIDTRANS')) {
      return {
        success: true,
        alreadyProcessed: true,
        message: 'Order sudah pernah diproses.',
      };
    }

    await supabase
      .from('orders')
      .upsert({
        id: orderId,
        username,
        package: `${amount} Robux`,
        price: typeof price === 'number' ? price : Number(String(price || '').replace(/[^0-9]/g, '')) || null,
        status: 'processing',
        proof: `PAID VIA MIDTRANS (${source})`,
      });
  } catch (error) {
    console.warn('Order tracking unavailable before payout:', error);
  }

  const payoutResult = await executeRobuxPayout(username, amount);

  try {
    await supabase
      .from('orders')
      .upsert({
        id: orderId,
        username,
        package: `${amount} Robux`,
        price: typeof price === 'number' ? price : Number(String(price || '').replace(/[^0-9]/g, '')) || null,
        status: payoutResult.success ? 'completed' : 'payout_failed',
        proof: payoutResult.success ? `PAID VIA MIDTRANS (${source})` : `PAYOUT FAILED: ${payoutResult.message || 'Unknown error'}`,
      });
  } catch (error) {
    console.warn('Order tracking unavailable after payout:', error);
  }

  return payoutResult;
}
