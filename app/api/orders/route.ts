import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function jsonNoStore(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...noStoreHeaders,
      ...(init?.headers || {}),
    },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { username, packageName, price, orderId, status } = formData;

    if (!username || !packageName || !price) {
      return jsonNoStore({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    const normalizedPrice = typeof price === 'string'
      ? Number(price.toString().replace(/[^0-9]/g, ''))
      : Number(price);

    if (Number.isNaN(normalizedPrice)) {
      return jsonNoStore({ success: false, message: 'Harga tidak valid' }, { status: 400 });
    }

    const generatedId = orderId || `ORDER-${Date.now()}`;

    const { data, error } = await supabase
      .from('orders')
      .upsert({
        id: generatedId,
        username,
        package: packageName,
        price: normalizedPrice,
        status: status || 'pending',
        proof: 'MIDTRANS'
      });

    if (error) throw error;

    return jsonNoStore({ 
      success: true, 
      message: 'Pesanan berhasil dicatat di Supabase',
      orderId: generatedId 
    });
  } catch (error: any) {
    console.error('Supabase Save Order Error:', error);
    return jsonNoStore({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return jsonNoStore(data || []);
  } catch (error: any) {
    console.error('Supabase Fetch Orders Error:', error);
    return jsonNoStore({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    const ALLOWED_STATUSES = [
      'pending', 'success', 'settlement', 'failure', 'expire', 'cancel', 
      'processing', 'completed', 'payout_failed', 'manual_payout'
    ];
    
    if (!id || !status || !ALLOWED_STATUSES.includes(status)) {
      return jsonNoStore({ success: false, message: 'ID atau Status tidak valid' }, { status: 400 });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return jsonNoStore({ success: true });
  } catch (error: any) {
    console.error('Supabase Update Order Error:', error);
    return jsonNoStore({ success: false, message: error.message }, { status: 500 });
  }
}
