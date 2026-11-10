import { pgTable, text, integer, boolean, timestamp, jsonb, serial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. Sellers / Merchants Table
export const sellers = pgTable('sellers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  businessName: text('business_name'),
  location: text('location').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationBadge: text('verification_badge').default('Physical Shop Inspected'),
  totalListings: integer('total_listings').default(0).notNull(),
  totalListingFeesPaid: integer('total_listing_fees_paid').default(0).notNull(),
  joinedDate: text('joined_date').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'suspended'
  packagePlan: text('package_plan').default('Basic').notNull(), // 'Basic' | 'Featured' | 'VIP'
  subscriptionExpiresAt: text('subscription_expires_at').notNull(),
  photographyService: boolean('photography_service').default(false),
  notes: text('notes'),
  suspendedReason: text('suspended_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  problemSolved: text('problem_solved'),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  category: text('category').notNull(),
  condition: text('condition').notNull(),
  images: jsonb('images').$type<string[]>().default([]).notNull(),
  sellerId: text('seller_id').references(() => sellers.id).notNull(),
  sellerName: text('seller_name').notNull(),
  sellerPhone: text('seller_phone').notNull(),
  sellerWhatsapp: text('seller_whatsapp').notNull(),
  sellerLocation: text('seller_location').notNull(),
  sellerVerified: boolean('seller_verified').default(false).notNull(),
  sellerBadge: text('seller_badge').default('Verified Merchant').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isPinnedTop: boolean('is_pinned_top').default(false).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'sold' | 'inactive' | 'suspended'
  viewsCount: integer('views_count').default(0).notNull(),
  whatsappClicks: integer('whatsapp_clicks').default(0).notNull(),
  callClicks: integer('call_clicks').default(0).notNull(),
  listingPlan: text('listing_plan').default('Basic').notNull(),
  listingFee: integer('listing_fee').default(0).notNull(),
  specs: jsonb('specs').$type<Record<string, string>>(),
  createdAt: text('created_at').notNull(),
});

// 3. Order / WhatsApp Inquiries Table
export const orderInquiries = pgTable('order_inquiries', {
  id: text('id').primaryKey(),
  productId: text('product_id').references(() => products.id).notNull(),
  productTitle: text('product_title').notNull(),
  productPrice: integer('product_price').notNull(),
  buyerName: text('buyer_name').notNull(),
  buyerPhone: text('buyer_phone').notNull(),
  buyerLocation: text('buyer_location').notNull(),
  notes: text('notes'),
  status: text('status').default('pending').notNull(), // 'pending' | 'contacted' | 'completed' | 'cancelled'
  createdAt: text('created_at').notNull(),
});

// 4. Analytics Click Events Table
export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  productId: text('product_id').references(() => products.id),
  eventType: text('event_type').notNull(), // 'view' | 'whatsapp_click' | 'call_click'
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
