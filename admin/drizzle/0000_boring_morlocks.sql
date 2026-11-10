CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text,
	"event_type" text NOT NULL,
	"ip_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"product_title" text NOT NULL,
	"product_price" integer NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_phone" text NOT NULL,
	"buyer_location" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"problem_solved" text,
	"price" integer NOT NULL,
	"original_price" integer,
	"category" text NOT NULL,
	"condition" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seller_id" text NOT NULL,
	"seller_name" text NOT NULL,
	"seller_phone" text NOT NULL,
	"seller_whatsapp" text NOT NULL,
	"seller_location" text NOT NULL,
	"seller_verified" boolean DEFAULT false NOT NULL,
	"seller_badge" text DEFAULT 'Verified Merchant' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_pinned_top" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"whatsapp_clicks" integer DEFAULT 0 NOT NULL,
	"call_clicks" integer DEFAULT 0 NOT NULL,
	"listing_plan" text DEFAULT 'Basic' NOT NULL,
	"listing_fee" integer DEFAULT 0 NOT NULL,
	"specs" jsonb,
	"created_at" text NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"business_name" text,
	"location" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_badge" text DEFAULT 'Physical Shop Inspected',
	"total_listings" integer DEFAULT 0 NOT NULL,
	"total_listing_fees_paid" integer DEFAULT 0 NOT NULL,
	"joined_date" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"package_plan" text DEFAULT 'Basic' NOT NULL,
	"subscription_expires_at" text NOT NULL,
	"photography_service" boolean DEFAULT false,
	"notes" text,
	"suspended_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_inquiries" ADD CONSTRAINT "order_inquiries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE no action ON UPDATE no action;