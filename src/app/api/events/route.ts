import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, eventType } = body;

    if (!productId || !['view', 'whatsapp', 'call'].includes(eventType)) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    const tracked = trackEvent(productId, eventType);
    return NextResponse.json({ success: tracked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
