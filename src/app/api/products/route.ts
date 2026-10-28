import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const sellerId = searchParams.get('sellerId') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const products = getAllProducts({
      category,
      search,
      condition,
      featuredOnly,
      sellerId,
      sortBy,
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.price || !body.category || !body.sellerId) {
      return NextResponse.json(
        { success: false, error: 'Title, price, category, and seller are required.' },
        { status: 400 }
      );
    }

    const newProduct = createProduct({
      title: body.title,
      description: body.description || '',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      category: body.category,
      condition: body.condition || 'Brand New',
      images: body.images && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
      ],
      sellerId: body.sellerId,
      sellerName: body.sellerName || 'Verified Merchant',
      sellerPhone: body.sellerPhone || '',
      sellerWhatsapp: body.sellerWhatsapp || '',
      sellerLocation: body.sellerLocation || 'City Center',
      sellerVerified: body.sellerVerified !== undefined ? body.sellerVerified : true,
      sellerBadge: body.sellerBadge || 'Physical Shop Verified',
      isFeatured: Boolean(body.isFeatured),
      status: body.status || 'active',
      listingPlan: body.listingPlan || 'Basic',
      listingFee: Number(body.listingFee || 15),
      specs: body.specs || {},
      problemSolved: body.problemSolved || undefined,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
