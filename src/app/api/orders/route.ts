import { NextResponse } from 'next/server';
import { getAllOrders, createOrderInquiry, updateOrderStatus } from '@/lib/db';

export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.productId || !body.buyerName || !body.buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'Product, Buyer Name, and Phone are required' },
        { status: 400 }
      );
    }

    const order = createOrderInquiry({
      productId: body.productId,
      productTitle: body.productTitle || 'Product',
      productPrice: Number(body.productPrice || 0),
      buyerName: body.buyerName,
      buyerPhone: body.buyerPhone,
      buyerLocation: body.buyerLocation || 'To be confirmed',
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status required' }, { status: 400 });
    }

    const updated = updateOrderStatus(id, status);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
