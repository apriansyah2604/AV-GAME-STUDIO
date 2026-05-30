import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { username, packageName, price, proofBase64 } = formData;

    if (!username || !packageName || !price) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    let orders = [];
    if (fs.existsSync(ORDERS_FILE)) {
      const fileData = fs.readFileSync(ORDERS_FILE, 'utf8');
      orders = JSON.parse(fileData);
    }

    const newOrder = {
      id: `ORDER-${Date.now()}`,
      username,
      package: packageName,
      price,
      status: 'pending',
      timestamp: new Date().toISOString(),
      proof: proofBase64
    };

    orders.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, message: 'Pesanan berhasil dikirim' });
  } catch (error: any) {
    console.error('Save Order Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const fileData = fs.readFileSync(ORDERS_FILE, 'utf8');
      return NextResponse.json(JSON.parse(fileData));
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!fs.existsSync(ORDERS_FILE)) {
      return NextResponse.json({ success: false, message: 'File tidak ditemukan' }, { status: 404 });
    }

    const fileData = fs.readFileSync(ORDERS_FILE, 'utf8');
    let orders = JSON.parse(fileData);
    
    orders = orders.map((order: any) => 
      order.id === id ? { ...order, status } : order
    );

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
