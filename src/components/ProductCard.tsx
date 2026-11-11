'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye, MessageCircle, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, buildWhatsAppLink } from '@/lib/utils';
import FlyerModal from './FlyerModal';
import OrderModal from './OrderModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, eventType: 'whatsapp' }),
      });
    } catch (err) {
      // Non-blocking
    }

    const waLink = buildWhatsAppLink({
      phone: product.sellerWhatsapp || product.sellerPhone,
      productTitle: product.title,
      price: product.price,
      productId: product.id,
      sellerName: product.sellerName,
    });
    window.open(waLink, '_blank');
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition duration-200 hover:shadow-md hover:border-slate-300">
        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap items-center gap-1.5">
          {product.isFeatured && (
            <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider shadow-2xs">
              HOT
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-2xs">
              -{discountPercent}%
            </span>
          )}
          <span className="rounded bg-white/95 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-800 shadow-2xs">
            {product.condition}
          </span>
        </div>

        {/* Quick Flyer Tool */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFlyerOpen(true);
          }}
          title="Create WhatsApp Status Flyer"
          className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-white/95 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-emerald-800 hover:text-white transition shadow-2xs"
        >
          Flyer
        </button>

        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Link href={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={images[currentImgIndex]}
              alt={product.title}
              className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-102"
              loading="lazy"
            />
          </Link>

          {/* Multi-image indicator & controls */}
          {images.length > 1 && (
            <>
              <div className="absolute bottom-2.5 left-2.5 rounded bg-slate-900/80 px-2 py-0.5 text-xs font-semibold text-white">
                {currentImgIndex + 1}/{images.length}
              </div>

              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition"
                title="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition"
                title="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4 justify-between">
          <div>
            {/* Price Line & Views */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <span
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                title="Total Buyer Views"
              >
                <Eye className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                <span>{product.viewsCount || 0}</span>
              </span>
            </div>

            {/* Product Title */}
            <Link href={`/product/${product.id}`} className="mt-1.5 block">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-emerald-800 transition leading-snug">
                {product.title}
              </h3>
            </Link>

            {/* Problem Solved Badge */}
            {product.problemSolved && (
              <p className="mt-2 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200/80 rounded-md px-2 py-1 line-clamp-1 font-medium">
                {product.problemSolved}
              </p>
            )}

            {/* Verified Merchant & Location */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
              <span className="font-bold text-emerald-900">Verified</span>
              <span className="text-slate-400">•</span>
              <span className="truncate">{product.sellerName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 truncate">{product.sellerLocation}</span>
            </div>
          </div>

          {/* Action Footer: Prominent High-Converting WhatsApp Button */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 rounded-lg bg-emerald-800 py-2.5 px-3 text-xs font-bold text-white hover:bg-emerald-900 active:bg-emerald-950 transition flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOrderOpen(true);
              }}
              title="Reserve Item"
              className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white transition"
            >
              Reserve
            </button>
          </div>
        </div>
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
    </>
  );
}
