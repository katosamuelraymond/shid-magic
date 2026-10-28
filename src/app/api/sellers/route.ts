import { NextResponse } from 'next/server';
import { getAllSellers, createSeller, updateSeller, getAllProducts } from '@/lib/db';

export async function GET() {
  try {
    const sellers = getAllSellers();
    const products = getAllProducts();

    // Enrich sellers with real-time views and leads
    const enriched = sellers.map((seller) => {
      const sellerProducts = products.filter((p) => p.sellerId === seller.id);
      const totalViews = sellerProducts.reduce((acc, p) => acc + p.viewsCount, 0);
      const totalLeads = sellerProducts.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);
      return {
        ...seller,
        activeListingsCount: sellerProducts.filter((p) => p.status === 'active').length,
        totalViews,
        totalLeads,
      };
    });

    return NextResponse.json({ success: true, sellers: enriched });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'Name and Phone are required' }, { status: 400 });
    }

    const newSeller = createSeller({
      name: body.name,
      phone: body.phone,
      whatsappNumber: body.whatsappNumber || body.phone.replace(/[^0-9]/g, ''),
      businessName: body.businessName || '',
      location: body.location || 'Local Merchant',
      isVerified: body.isVerified !== undefined ? body.isVerified : true,
      verificationBadge: body.verificationBadge || 'Physical Shop Verified',
    });

    return NextResponse.json({ success: true, seller: newSeller }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Seller id is required' }, { status: 400 });
    }
    const updated = updateSeller(id, updates);
    return NextResponse.json({ success: true, seller: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
