import { NextResponse } from 'next/server';
import {
  getAllSellers,
  createSeller,
  updateSeller,
  getAllProducts,
  toggleSellerSuspension,
  renewSellerSubscription,
  deleteSeller,
} from '@/lib/db';

export async function GET() {
  try {
    const sellers = getAllSellers();
    const products = getAllProducts({ includeHidden: true });

    // Enrich sellers with real-time views, active counts, and leads
    const enriched = sellers.map((seller) => {
      const sellerProducts = products.filter((p) => p.sellerId === seller.id);
      const totalViews = sellerProducts.reduce((acc, p) => acc + p.viewsCount, 0);
      const totalLeads = sellerProducts.reduce((acc, p) => acc + p.whatsappClicks + p.callClicks, 0);
      
      const now = new Date().getTime();
      const expiry = new Date(seller.subscriptionExpiresAt).getTime();
      const isExpired = expiry <= now;
      const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

      return {
        ...seller,
        totalProductsCount: sellerProducts.length,
        activeListingsCount: sellerProducts.filter((p) => p.status === 'active').length,
        suspendedListingsCount: sellerProducts.filter((p) => p.status === 'suspended').length,
        totalViews,
        totalLeads,
        isExpired,
        daysRemaining,
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

    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + (body.durationDays ? Number(body.durationDays) : 30));

    const newSeller = createSeller({
      name: body.name,
      phone: body.phone,
      whatsappNumber: body.whatsappNumber || body.phone.replace(/[^0-9]/g, ''),
      businessName: body.businessName || '',
      location: body.location || 'Kampala, Uganda',
      isVerified: body.isVerified !== undefined ? body.isVerified : true,
      verificationBadge: body.verificationBadge || 'Physical Shop Verified',
      status: body.status || 'active',
      packagePlan: body.packagePlan || 'Basic',
      subscriptionExpiresAt: body.subscriptionExpiresAt || defaultExpiry.toISOString(),
      photographyService: Boolean(body.photographyService),
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, seller: newSeller }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Seller id is required' }, { status: 400 });
    }

    // 1-Click Action: Suspend or Reactivate (scraps all their goods from view)
    if (action === 'toggle-suspend') {
      const result = toggleSellerSuspension(id, Boolean(body.suspend), body.reason);
      return NextResponse.json({
        success: true,
        seller: result.seller,
        affectedProducts: result.affectedProducts,
        message: body.suspend
          ? 'Client suspended. All goods hidden from public view.'
          : 'Client reactivated. All goods restored online.',
      });
    }

    // 1-Click Action: Renew subscription period upon payment
    if (action === 'renew') {
      const days = Number(body.days || 30);
      const feePaid = Number(body.feePaid || 0);
      const renewed = renewSellerSubscription(id, days, feePaid);
      return NextResponse.json({
        success: true,
        seller: renewed,
        message: `Subscription extended by ${days} days. All products reactivated!`,
      });
    }

    // General update
    const updated = updateSeller(id, updates);
    return NextResponse.json({ success: true, seller: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Seller id is required' }, { status: 400 });
    }

    const success = deleteSeller(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Seller and their products deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
