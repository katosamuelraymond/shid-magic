import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.SHID_ADMIN_PASSWORD || 'shid2026';
const ADMIN_COOKIE_NAME = 'shid_admin_session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin passcode or access credentials.' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated_admin_shidmagic_2026', {
      httpOnly: false, // allow client-side hydration check as well
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true, message: 'Admin authenticated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    const isAuthenticated = session?.value === 'authenticated_admin_shidmagic_2026';

    return NextResponse.json({ success: true, authenticated: isAuthenticated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
