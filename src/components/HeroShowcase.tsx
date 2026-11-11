'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { MessageCircle, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

interface HeroShowcaseProps {
  products: Product[];
}

export default function HeroShowcase({ products }: HeroShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const spotlightItems = products.slice(0, 5);

  useEffect(() => {
    if (spotlightItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % spotlightItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeIndex, spotlightItems.length]);

  if (spotlightItems.length === 0) return null;

  const current = spotlightItems[activeIndex];

  return (
    <section className="relative bg-[#064e3b] text-white border-b border-[#04382a] overflow-hidden">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-5 sm:pb-6">
        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Mobile Product Image Display */}
          <div className="lg:hidden w-full">
            <Link
              href={`/product/${current.id}`}
              className="relative h-[220px] sm:h-[260px] w-full overflow-hidden rounded-xl bg-slate-900 border border-emerald-700/60 block shadow-md group"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/85 px-2.5 py-1 text-xs font-bold text-white shadow border border-emerald-800">
                Tap to Inspect Details
              </span>
              <span className="absolute top-2.5 right-2.5 rounded-lg bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 shadow">
                {formatPrice(current.price)}
              </span>
            </Link>
          </div>

          {/* Text Details & Narrative (7 Cols Desktop) - Natural dynamic height, zero clipping */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3 py-1">
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase bg-[#04382a] border border-emerald-600/60 px-2.5 py-0.5 rounded flex-shrink-0">
                Verified Spotlight #{activeIndex + 1}
              </span>
              <span className="text-xs text-emerald-200 font-medium truncate">
                {current.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug line-clamp-2">
                {current.title}
              </h1>
            </div>

            {/* Problem Solved Highlight Box */}
            <div className="flex items-center bg-[#04382a] border-l-4 border-amber-400 px-3 py-2 rounded-r-md">
              <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-snug line-clamp-2">
                {current.problemSolved || 'Directly inspected & verified by ShidMagic team for reliability in Kampala.'}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-2 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Price & Merchant */}
            <div className="flex flex-wrap items-baseline gap-2.5 pt-0.5">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 tracking-tight">
                {formatPrice(current.price)}
              </span>
              {current.originalPrice && current.originalPrice > current.price && (
                <span className="text-xs sm:text-sm text-emerald-300/60 line-through">
                  {formatPrice(current.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-100 bg-[#04382a] px-2.5 py-1 rounded border border-emerald-700/50 truncate max-w-[280px] sm:max-w-none">
                Merchant: {current.sellerName} ({current.sellerLocation})
              </span>
            </div>

            {/* Action Buttons: Fully visible with clear spacing & generous hit area */}
            <div className="flex flex-wrap items-center gap-3 pt-3 pb-1">
              <a
                href={`https://wa.me/${current.sellerWhatsapp || current.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${current.sellerName}, I found your listing for "${current.title}" on ShidMagic. Is this available in stock?`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#16a34a] hover:bg-[#15803d] border border-emerald-400/40 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href={`/product/${current.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 px-5 py-2.5 text-xs font-black text-slate-950 transition shadow-sm"
              >
                <span>Inspect Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Desktop Large Image Canvas (5 Cols Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 min-h-[300px] w-full">
            <Link
              href={`/product/${current.id}`}
              className="relative h-full w-full rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 block group border border-emerald-700/60 bg-slate-900"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-cover group-hover:scale-103 transition duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow border border-emerald-800">
                Click to Inspect Details & Photos
              </div>
              <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg shadow">
                {formatPrice(current.price)}
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Interactive Thumbnail Reel */}
        <div className="mt-8 pt-5 border-t border-emerald-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {spotlightItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-[72px] text-left rounded-lg p-2.5 transition relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border-2 border-amber-400 bg-[#04382a] text-white shadow-sm'
                      : 'border border-emerald-800/70 bg-[#064e3b]/80 text-emerald-100 hover:bg-[#04382a]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-9 w-9 rounded-md object-contain bg-white p-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-white">
                        {item.title}
                      </p>
                      <p className={`text-xs font-black ${isActive ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[9px] font-bold">
                    {isActive ? (
                      <>
                        <span className="text-amber-300">● ACTIVE NOW</span>
                        <span className="text-amber-300">Viewing</span>
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-400/80">Slide #{idx + 1}</span>
                        <span className="text-emerald-400/80">Select</span>
                      </>
                    )}
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 overflow-hidden">
                      <div className="h-full bg-amber-400 animate-[progress_4.5s_linear]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
