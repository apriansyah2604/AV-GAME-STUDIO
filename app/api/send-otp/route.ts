import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();
    const token = process.env.FONNTE_TOKEN;
    const target = process.env.ADMIN_WHATSAPP;

    if (!token || token === "your-fonnte-token-here") {
      return NextResponse.json({ 
        success: false, 
        message: 'Token Fonnte belum diisi di file .env' 
      }, { status: 500 });
    }

    if (!target || target === "628xxx") {
      return NextResponse.json({ 
        success: false, 
        message: 'Nomor WhatsApp Admin belum diisi di file .env' 
      }, { status: 500 });
    }

    const message = `*AV STUDIO SECURITY*\n\nKode OTP Admin Anda adalah: *${otp}*\n\nJangan berikan kode ini kepada siapapun demi keamanan dashboard Anda.`;

    // Pastikan nomor target dalam format string dan tidak ada spasi
    const cleanTarget = target.toString().trim().replace(/\s+/g, '');

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: new URLSearchParams({
        'target': cleanTarget,
        'message': message,
        'countryCode': '62'
      })
    });

    const result = await response.json();

    if (result.status) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Fonnte Error:', result.reason);
      return NextResponse.json({ success: false, message: result.reason }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
