import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { user: null, error: 'Supabase is not configured.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { getUserById } = await import('@/lib/storage');
    const user = await getUserById(sessionId.value);

    if (!user) {
      cookieStore.delete('session_id');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Local session check error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
