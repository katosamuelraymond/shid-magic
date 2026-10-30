import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Please provide DATABASE_URL to seed.');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL database...');
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  // Read marketplace.json
  const dataPath = path.join(process.cwd(), 'data', 'marketplace.json');
  if (!fs.existsSync(dataPath)) {
    console.error('marketplace.json not found at:', dataPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Found ${data.sellers?.length || 0} sellers and ${data.products?.length || 0} products.`);

  // 1. Seed Sellers
  if (data.sellers && data.sellers.length > 0) {
    for (const s of data.sellers) {
      await db
        .insert(schema.sellers)
        .values({
          id: s.id,
          name: s.name,
          phone: s.phone,
          whatsappNumber: s.whatsappNumber,
          businessName: s.businessName || null,
          location: s.location,
          isVerified: Boolean(s.isVerified),
          verificationBadge: s.verificationBadge || 'Physical Shop Inspected',
          totalListings: s.totalListings || 0,
          totalListingFeesPaid: s.totalListingFeesPaid || 0,
          joinedDate: s.joinedDate || new Date().toISOString().split('T')[0],
          status: s.status || 'active',
          packagePlan: s.packagePlan || 'Basic',
          subscriptionExpiresAt: s.subscriptionExpiresAt || new Date().toISOString(),
          photographyService: Boolean(s.photographyService),
          notes: s.notes || null,
          suspendedReason: s.suspendedReason || null,
        })
        .onConflictDoNothing();
    }
    console.log('✓ Sellers seeded successfully.');
  }

  // 2. Seed Products
  if (data.products && data.products.length > 0) {
    for (const p of data.products) {
      await db
        .insert(schema.products)
        .values({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          problemSolved: p.problemSolved || null,
          price: p.price,
          originalPrice: p.originalPrice || null,
          category: p.category,
          condition: p.condition,
          images: p.images || [],
          sellerId: p.sellerId,
          sellerName: p.sellerName,
          sellerPhone: p.sellerPhone,
          sellerWhatsapp: p.sellerWhatsapp,
          sellerLocation: p.sellerLocation,
          sellerVerified: Boolean(p.sellerVerified),
          sellerBadge: p.sellerBadge || 'Verified Merchant',
          isFeatured: Boolean(p.isFeatured),
          isPinnedTop: Boolean(p.isPinnedTop),
          status: p.status || 'active',
          viewsCount: p.viewsCount || 0,
          whatsappClicks: p.whatsappClicks || 0,
          callClicks: p.callClicks || 0,
          listingPlan: p.listingPlan || 'Basic',
          listingFee: p.listingFee || 0,
          specs: p.specs || null,
          createdAt: p.createdAt || new Date().toISOString(),
        })
        .onConflictDoNothing();
    }
    console.log('✓ Products seeded successfully.');
  }

  // 3. Seed Orders if any
  if (data.orders && data.orders.length > 0) {
    for (const o of data.orders) {
      await db
        .insert(schema.orderInquiries)
        .values({
          id: o.id,
          productId: o.productId,
          productTitle: o.productTitle,
          productPrice: o.productPrice,
          buyerName: o.buyerName,
          buyerPhone: o.buyerPhone,
          buyerLocation: o.buyerLocation,
          notes: o.notes || null,
          status: o.status || 'pending',
          createdAt: o.createdAt || new Date().toISOString(),
        })
        .onConflictDoNothing();
    }
    console.log('✓ Orders seeded successfully.');
  }

  console.log('Database seeding complete!');
  await client.end();
}

main().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
