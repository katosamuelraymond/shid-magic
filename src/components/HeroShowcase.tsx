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

  // Curated spotlight solutions
  const spotlightItems = products.slice(0, 5);

  // Auto-advance every 4.2 seconds continuously
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
    <section className="relative bg-white border-b border-slate-200 overflow-hidden">
      {/* Tightly spaced container: pt-2 sm:pt-3 so first word starts immediately below navbar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5 pb-6">
        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center min-h-[320px] sm:min-h-[350px]">
          {/* Left Text & Solution Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100/80 px-2.5 py-0.5 rounded">
                Verified Solution #{activeIndex + 1}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {current.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {current.title}
            </h1>

            {current.problemSolved && (
              <div className="bg-slate-50 border-l-4 border-emerald-700 p-2.5 rounded-r-md">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {current.problemSolved}
                </p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {current.description}
            </p>

            {/* Price & Merchant Origin */}
            <div className="pt-1 flex flex-wrap items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatPrice(current.price)}
              </span>
              {current.originalPrice && current.originalPrice > current.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  {formatPrice(current.originalPrice)}
                </span>
              )}
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                Shop: {current.sellerName} ({current.sellerLocation})
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/product/${current.id}`}
                className="rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
              >
                Inspect Solution Details
              </Link>
              <a
                href={`https://wa.me/${current.sellerWhatsapp || current.sellerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${current.sellerName}, I found your listing for "${current.title}" on ShidMagic. Is this available in stock?`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Floating Product Canvas (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <Link
              href={`/product/${current.id}`}
              className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] rounded-xl bg-slate-50 border border-slate-200 p-3 shadow-xs hover:shadow-md transition block group"
            >
              <img
                src={current.images[0]}
                alt={current.title}
                key={current.id}
                className="h-full w-full object-contain transition duration-500 group-hover:scale-105 animate-in fade-in duration-300"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                Click to View Photos
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Interactive Thumbnail Selector (Shows all products, auto-moves & indicates active) */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Moving Spotlight Reel (Click any item to inspect)
            </span>
            <span className="text-[11px] font-medium text-emerald-700">
              Auto-advancing • #{activeIndex + 1} of {spotlightItems.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {spotlightItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-left rounded-xl p-2 sm:p-2.5 transition relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border-2 border-emerald-700 bg-emerald-50/80 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-9 w-9 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] font-bold text-slate-900 truncate">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-[10px] font-black text-emerald-800">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator & Animated Progress Fill */}
                  {isActive && (
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold text-emerald-800 border-t border-emerald-200/80 pt-1">
                      <span>● ACTIVE NOW</span>
                      <span className="text-[8px] text-emerald-700 font-semibold">Viewing</span>
                    </div>
                  )}

                  {/* Progress bar across bottom of active card */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-200 overflow-hidden">
                      <div className="h-full bg-emerald-700 animate-[progress_4.2s_linear]" />
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
