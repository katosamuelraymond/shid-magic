'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:shadow-md hover:border-slate-400">
        {/* Top Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1">
          {product.isFeatured && (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
              HOT
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
          <span className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-medium text-white">
            {product.condition}
          </span>
        </div>

        {/* Quick Flyer tool */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFlyerOpen(true);
          }}
          title="Create WhatsApp Status Flyer"
          className="absolute right-2 top-2 z-10 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-emerald-700 hover:text-white transition shadow-xs"
        >
          Flyer
        </button>

        {/* Image Container (Aspect Square for clean grid) */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Link href={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={images[currentImgIndex]}
              alt={product.title}
              className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-102"
              loading="lazy"
            />
          </Link>

          {/* Multi-image indicators */}
          {images.length > 1 && (
            <>
              <div className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-medium text-white">
                {currentImgIndex + 1}/{images.length}
              </div>

              <button
                onClick={handlePrevImage}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition"
                title="Previous photo"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition"
                title="Next photo"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Compact Card Body */}
        <div className="flex flex-1 flex-col p-3">
          {/* Price line & Real Views Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded" title="Total Buyer Views">
              👁️ {product.viewsCount || 0}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="mt-1 block">
            <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-emerald-700 transition leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Problem Solved Badge */}
          {product.problemSolved && (
            <p className="mt-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.5 line-clamp-1 font-medium">
              {product.problemSolved}
            </p>
          )}

          {/* Verified Merchant Text */}
          <div className="mt-2 text-[10px] text-slate-500 truncate">
            <span className="font-semibold text-emerald-800">Verified</span> • {product.sellerName} ({product.sellerLocation})
          </div>

          {/* Action Footer */}
          <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 rounded-md bg-emerald-700 py-1.5 px-2 text-[11px] font-bold text-white hover:bg-emerald-800 transition text-center"
            >
              WhatsApp
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOrderOpen(true);
              }}
              title="Reserve Item"
              className="rounded-md border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-[11px] font-semibold text-slate-700 hover:border-slate-400 transition"
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
