import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { username, packageName, price, orderId, status } = formData;

    if (!username || !packageName || !price) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          id: orderId || `ORDER-${Date.now()}`, 
          username, 
          package: packageName, 
          price: price.toString(), 
          status: status || 'pending',
          proof: 'MIDTRANS'
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Pesanan berhasil dicatat di Supabase' });
  } catch (error: any) {
    console.error('Supabase Save Order Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Supabase Fetch Orders Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Supabase Update Order Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
