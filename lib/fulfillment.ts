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

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        proof: `PAID VIA MIDTRANS (${source})`,
        username, // Pastikan username terisi
        package: `${amount} Robux`,
        price: typeof price === 'number' ? price : Number(String(price || '').replace(/[^0-9]/g, '')) || null,
      })
      .eq('id', orderId)
      .in('status', ['pending', 'payout_failed']) // Hanya proses jika statusnya aman untuk diproses
      .select()
      .maybeSingle();

    if (updateError) throw updateError;

    // Jika tidak ada data yang diupdate, berarti order sudah diproses atau sedang diproses oleh request lain
    if (!updatedOrder) {
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .maybeSingle();
      
      if (currentOrder?.status === 'completed') {
        return { success: true, alreadyProcessed: true, message: 'Order sudah selesai.' };
      }
      if (currentOrder?.status === 'processing') {
        return { success: true, alreadyProcessed: true, message: 'Order sedang diproses sistem lain.' };
      }
      return { success: false, message: 'Gagal mengunci status order untuk diproses.' };
    }
  } catch (error: any) {
    console.warn('Order locking failed:', error.message);
    // Jika gagal mengunci, kita sebaiknya tidak lanjut untuk menghindari double payout
    return { success: false, message: 'Sistem sedang sibuk memproses pesanan ini.' };
  }

  // Lakukan Payout
  const payoutResult = await executeRobuxPayout(username, amount);
  console.log(`[PAYOUT] Result for ${username} (${amount} Robux):`, JSON.stringify(payoutResult));

  try {
    // Hanya update status jika payout benar-benar dieksekusi atau gagal
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
    
    // Logging kegagalan payout agar admin tahu alasannya
    if (!payoutResult.success) {
      console.error(`PAYOUT FAILED for ${orderId}:`, payoutResult.message);
    }
  } catch (error) {
    console.warn('Order tracking unavailable after payout:', error);
  }

  return payoutResult;
}
