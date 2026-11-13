import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function confirmPartnerOrder(orderId: string, paidAmount: number) {
  if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
    return { success: false, message: 'Nominal pembayaran tidak valid.' }
  }

  const supabase = getSupabaseAdmin()
  const { data: order, error: fetchError } = await supabase
    .from('partner_orders')
    .select('id, price, status')
    .eq('id', orderId)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!order) return { success: false, message: 'Pesanan partner tidak ditemukan.' }
  if (Number(order.price) !== paidAmount) {
    return { success: false, message: 'Nominal pembayaran tidak sesuai dengan pesanan partner.' }
  }
  if (order.status === 'paid' || order.status === 'processing' || order.status === 'completed') {
    return { success: true, alreadyProcessed: true }
  }
  if (order.status !== 'pending_payment') {
    return { success: false, message: 'Status pesanan tidak dapat dibayar.' }
  }

  const { data: updated, error: updateError } = await supabase
    .from('partner_orders')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('status', 'pending_payment')
    .select('id')
    .maybeSingle()

  if (updateError) throw updateError
  if (!updated) {
    const { data: current, error: currentError } = await supabase
      .from('partner_orders')
      .select('status')
      .eq('id', orderId)
      .maybeSingle()

    if (currentError) throw currentError
    if (current?.status === 'paid' || current?.status === 'processing' || current?.status === 'completed') {
      return { success: true, alreadyProcessed: true }
    }
    return { success: false, message: 'Pesanan tidak dapat diperbarui.' }
  }

  return { success: true, alreadyProcessed: false }
}
