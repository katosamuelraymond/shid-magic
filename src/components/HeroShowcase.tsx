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
        {/* Main Stage Grid - Locked uniform height across all slides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center lg:min-h-[300px]">
          {/* 1. On Mobile: Large, Bold Fitted Product Image with fixed height */}
          <div className="lg:hidden w-full">
            <Link
              href={`/product/${current.id}`}
              className="relative h-[200px] w-full overflow-hidden rounded-xl bg-white border border-emerald-700/60 block shadow-md p-2"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-contain"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                Tap to View Photos
              </span>
              <span className="absolute top-2 right-2 rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950 shadow">
                {formatPrice(current.price)}
              </span>
            </Link>
          </div>

          {/* 2. Text Details & Narrative (7 Cols Desktop) - Every slot locked to exact identical height */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2 sm:space-y-2.5 lg:h-[290px]">
            {/* Slot A: Category and Badge (Locked Height: 24px) */}
            <div className="h-6 flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-amber-300 uppercase bg-[#04382a] border border-emerald-600/60 px-2 py-0.5 rounded flex-shrink-0">
                Verified Solution #{activeIndex + 1}
              </span>
              <span className="text-[11px] text-emerald-200 font-medium truncate">
                {current.category}
              </span>
            </div>

            {/* Slot B: Title (Locked Height: 54px on mobile, 60px on desktop) */}
            <div className="h-[52px] sm:h-[60px] flex items-center">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug line-clamp-2">
                {current.title}
              </h1>
            </div>

            {/* Slot C: Problem Solved Box (Locked Height: 44px on mobile, 46px on desktop) */}
            <div className="h-[44px] sm:h-[46px] flex items-center bg-[#04382a] border-l-4 border-amber-400 px-3 rounded-r-md overflow-hidden">
              <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-snug line-clamp-2">
                {current.problemSolved || 'Directly inspected & verified by ShidMagic team for reliability.'}
              </p>
            </div>

            {/* Slot D: Description (Locked Height: 36px on mobile, 38px on desktop) */}
            <div className="h-[36px] sm:h-[38px] flex items-center overflow-hidden">
              <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-2 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Slot E: Price & Merchant (Locked Height: 32px on mobile, 36px on desktop) */}
            <div className="h-[32px] sm:h-[36px] flex flex-wrap items-baseline gap-2.5 overflow-hidden">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 tracking-tight">
                {formatPrice(current.price)}
              </span>
              {current.originalPrice && current.originalPrice > current.price && (
                <span className="text-xs sm:text-sm text-emerald-300/60 line-through">
                  {formatPrice(current.originalPrice)}
                </span>
              )}
              <span className="text-[11px] text-emerald-100 bg-[#04382a] px-2 py-0.5 rounded border border-emerald-700/50 truncate max-w-[260px] sm:max-w-none">
                Merchant: {current.sellerName} ({current.sellerLocation})
              </span>
            </div>

            {/* Slot F: CTAs (Locked Height: 38px on mobile, 42px on desktop) */}
            <div className="h-[38px] sm:h-[42px] flex items-center gap-2.5 pt-0.5">
              <Link
                href={`/product/${current.id}`}
                className="h-full inline-flex items-center rounded-lg bg-amber-400 px-4 sm:px-5 text-xs font-black text-slate-950 hover:bg-amber-300 transition shadow-sm"
              >
                Inspect Solution Details
              </Link>
              <a
                href={`https://wa.me/${current.sellerWhatsapp || current.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${current.sellerName}, I found your listing for "${current.title}" on ShidMagic. Is this available in stock?`)}`}
                target="_blank"
                rel="noreferrer"
                className="h-full inline-flex items-center rounded-lg border border-emerald-400 bg-transparent px-3.5 sm:px-4 text-xs font-bold text-white hover:bg-emerald-800 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* 3. Desktop Large Image Canvas (5 Cols Desktop) - Fixed 290x290 box identical to iPhone slide */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <Link
              href={`/product/${current.id}`}
              className="relative h-[290px] w-[290px] rounded-xl bg-white p-3.5 shadow-lg hover:scale-101 transition block group border border-emerald-800/40"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                Click to View Photos
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Interactive Thumbnail Reel - Locked uniform card heights */}
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
                  className={`h-[68px] text-left rounded-lg p-2 transition relative overflow-hidden flex flex-col justify-between ${
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
                      <p className="text-[10px] font-bold truncate text-white">
                        {item.title}
                      </p>
                      <p className={`text-[10px] font-black ${isActive ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[8px] font-black">
                    {isActive ? (
                      <>
                        <span className="text-amber-300">● ACTIVE NOW</span>
                        <span className="text-amber-300">Viewing</span>
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-400/70">Slide #{idx + 1}</span>
                        <span className="text-emerald-400/70">Click</span>
                      </>
                    )}
                  </div>

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
