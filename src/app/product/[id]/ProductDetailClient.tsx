'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  MapPin,
  Sparkles,
  Share2,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Truck,
  Eye,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, buildWhatsAppLink } from '@/lib/utils';
import FlyerModal from '@/components/FlyerModal';
import OrderModal from '@/components/OrderModal';
import ProductCard from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [currentViews, setCurrentViews] = useState(product.viewsCount || 0);

  // Client-side real view tracking
  React.useEffect(() => {
    try {
      const sessionKey = `shid_viewed_${product.id}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, eventType: 'view' }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.success) {
              setCurrentViews((prev) => prev + 1);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      // Ignore in non-browser env
    }
  }, [product.id]);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppClick = () => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, eventType: 'whatsapp' }),
    }).catch(() => {});

    const waLink = buildWhatsAppLink({
      phone: product.sellerWhatsapp || product.sellerPhone,
      productTitle: product.title,
      price: product.price,
      productId: product.id,
      sellerName: product.sellerName,
    });
    window.open(waLink, '_blank');
  };

  const handleCallClick = () => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, eventType: 'call' }),
    }).catch(() => {});

    window.location.href = `tel:${product.sellerPhone}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium hover:text-emerald-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Goods</span>
          </Link>
          <div className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-slate-700 shadow-2xs font-semibold">
            <Eye className="h-3.5 w-3.5 text-emerald-700" />
            <span>{currentViews} Real Buyer Views</span>
          </div>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Photo Viewer */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="h-full w-full object-contain p-3"
              />

              {/* Floating badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-white">
                  {product.condition}
                </span>
                {discountPercent > 0 && (
                  <span className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    Save {discountPercent}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>

              {/* Multi-image photo counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 rounded-md bg-slate-900/75 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-white">
                  Photo {activeImageIndex + 1} of {images.length}
                </div>
              )}

              {/* Gallery Arrow Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md hover:bg-white transition"
                    title="Previous photo"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md hover:bg-white transition"
                    title="Next photo"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Flyer tool button */}
              <button
                onClick={() => setFlyerOpen(true)}
                title="Create Social Media Flyer"
                className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-xs hover:bg-emerald-600 hover:text-white transition"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail selector (if multiple images uploaded) */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-18 w-18 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} preview ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Item Specifications
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
                      <dt className="text-slate-500">{key}</dt>
                      <dd className="font-semibold text-slate-800">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Full Product Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Description
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Ordering & Merchant Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              {/* Category & Title */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  {product.category}
                </span>
                <h1 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {product.title}
                </h1>
                {product.problemSolved && (
                  <div className="mt-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950">
                    <span className="inline-block rounded bg-emerald-800 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider mb-1">
                      Problem Solved in Uganda
                    </span>
                    <p className="font-semibold text-emerald-900 leading-snug">
                      {product.problemSolved}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="ml-auto text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  In Stock
                </span>
              </div>

              {/* Live Views & Buyer Interest Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-black text-slate-900 block leading-tight">
                      {currentViews} Real Views
                    </span>
                    <span className="text-[10px] text-slate-500">Tracked in real-time</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-800 text-[11px] block leading-tight">
                    {product.whatsappClicks || 0} Buyer Inquiries
                  </span>
                  <span className="text-[10px] text-slate-400">Direct WhatsApp leads</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* 1. Direct WhatsApp */}
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-98 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat & Order on WhatsApp</span>
                </button>

                {/* 2. Direct Call */}
                <button
                  onClick={handleCallClick}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 px-4 text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Seller Directly ({product.sellerPhone})</span>
                </button>

                {/* 3. Reserve or callback */}
                <button
                  onClick={() => setOrderOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Reserve Item / Request Callback</span>
                </button>
              </div>

              {/* Verified Merchant Details Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {product.sellerName.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/merchant/${product.sellerId}`}
                        className="text-xs font-bold text-slate-900 hover:text-emerald-700 hover:underline block"
                        title="View Merchant Profile & All Listings"
                      >
                        {product.sellerName}
                      </Link>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {product.sellerPhone}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{product.sellerLocation}</span>
                </div>
              </div>

              {/* Safe Shopping Guarantee Box */}
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Vetted merchant inspected by platform admin.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Available for pickup or delivery with inspection.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Pay upon inspecting the item to your satisfaction.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              More Items in {product.category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <FlyerModal
        product={product}
        isOpen={flyerOpen}
        onClose={() => setFlyerOpen(false)}
      />

      <OrderModal
        product={product}
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
      />
    </div>
  );
}
