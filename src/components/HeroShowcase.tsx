'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

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
    }, 4200);
    return () => clearInterval(interval);
  }, [activeIndex, spotlightItems.length]);

  if (spotlightItems.length === 0) return null;

  const current = spotlightItems[activeIndex];

  return (
    <section className="relative bg-[#064e3b] text-white border-b border-[#04382a] overflow-hidden">
      {/* Tightly spaced container so the first word starts immediately below the navbar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5 pb-5 sm:pb-6">
        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
          {/* 1. On Mobile: Show Large, Bold Fitted Product Image FIRST so it's never small! */}
          <div className="lg:hidden w-full">
            <Link
              href={`/product/${current.id}`}
              className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#04382a] border border-emerald-700/60 block shadow-md"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white">
                Tap to View Product Photos
              </span>
              <span className="absolute top-2 right-2 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                {formatPrice(current.price)}
              </span>
            </Link>
          </div>

          {/* 2. Text Details & Narrative (7 Cols Desktop) */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-amber-300 uppercase bg-[#04382a] border border-emerald-600/60 px-2 py-0.5 rounded">
                Verified Solution #{activeIndex + 1}
              </span>
              <span className="text-[11px] text-emerald-200 font-medium">
                {current.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {current.title}
            </h1>

            {current.problemSolved && (
              <div className="bg-[#04382a] border-l-4 border-amber-400 p-2.5 rounded-r-md">
                <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-snug">
                  {current.problemSolved}
                </p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-2 leading-relaxed">
              {current.description}
            </p>

            {/* Price & Merchant Origin */}
            <div className="pt-1 flex flex-wrap items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {formatPrice(current.price)}
              </span>
              {current.originalPrice && current.originalPrice > current.price && (
                <span className="text-xs sm:text-sm text-emerald-300/60 line-through">
                  {formatPrice(current.originalPrice)}
                </span>
              )}
              <span className="text-[11px] text-emerald-100 bg-[#04382a] px-2.5 py-0.5 rounded border border-emerald-700/50">
                Merchant: {current.sellerName} ({current.sellerLocation})
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/product/${current.id}`}
                className="rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition shadow-sm"
              >
                Inspect Solution Details
              </Link>
              <a
                href={`https://wa.me/${current.sellerWhatsapp || current.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${current.sellerName}, I found your listing for "${current.title}" on ShidMagic. Is this available in stock?`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-emerald-400 bg-transparent px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* 3. Desktop Large Image Canvas (5 Cols Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <Link
              href={`/product/${current.id}`}
              className="relative aspect-square w-full max-w-[340px] rounded-xl bg-white p-3 shadow-lg hover:scale-102 transition block group"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                Click to View Photos
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Interactive Thumbnail Reel */}
        <div className="mt-5 pt-3.5 border-t border-emerald-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Moving Spotlight Reel (Click any item to view)
            </span>
            <span className="text-[11px] font-medium text-amber-300">
              Auto-advancing • #{activeIndex + 1} of {spotlightItems.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {spotlightItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-left rounded-lg p-2 transition relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border-2 border-amber-400 bg-[#04382a] text-white shadow-sm'
                      : 'border border-emerald-800/70 bg-[#064e3b]/80 text-emerald-100 hover:bg-[#04382a]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-9 w-9 rounded-md object-cover bg-white flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold truncate text-white">
                        {item.title}
                      </p>
                      <p className={`text-[10px] font-black ${isActive ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-1 flex items-center justify-between text-[8px] font-black text-amber-300 border-t border-emerald-700/60 pt-0.5">
                      <span>● ACTIVE NOW</span>
                      <span>Viewing</span>
                    </div>
                  )}

                  {/* Progress bar across bottom of active card */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 overflow-hidden">
                      <div className="h-full bg-amber-400 animate-[progress_4.2s_linear]" />
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
