import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/storage';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

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
