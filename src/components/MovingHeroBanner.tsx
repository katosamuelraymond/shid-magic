'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Droplets,
  Radio,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface MovingHeroBannerProps {
  products: Product[];
}

export default function MovingHeroBanner({ products }: MovingHeroBannerProps) {
  // Use first 5 or 6 products duplicated for infinite smooth scroll
  const showcaseProducts = products.slice(0, 6);
  const tickerItems = [...showcaseProducts, ...showcaseProducts];

  return (
    <div className="relative overflow-hidden border-b border-slate-200/90 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 pt-8 pb-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-radial from-emerald-400/10 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Badges & Main Headline */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Curated Problem-Solvers • Verified Kampala Shops</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            High-Impact Solutions for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Everyday Life in Uganda
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From Umeme blackout solar generators and shower water pressure booster pumps to Starlink satellite internet and verified phones. Hand-reviewed by our admin team with authentic physical shop locations.
          </p>

          {/* Quick Problem Pills */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-1 font-semibold text-amber-800">
              <Zap className="h-3 w-3 text-amber-600" />
              Umeme Blackout Proof
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 font-semibold text-blue-800">
              <Droplets className="h-3 w-3 text-blue-600" />
              Low Water Pressure Solved
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200/80 px-2.5 py-1 font-semibold text-purple-800">
              <Radio className="h-3 w-3 text-purple-600" />
              Unlimited Remote Internet
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 font-semibold text-emerald-800">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              MTN MoMo & Airtel Money
            </span>
          </div>
        </div>

        {/* Moving Products Marquee (CSS Animated Continuous Reel) */}
        <div className="pt-4 relative">
          {/* Subtle gradient side fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Moving Reel Track */}
          <div className="flex gap-4 overflow-hidden select-none group py-2">
            <div className="flex gap-3.5 sm:gap-4 animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] flex-shrink-0">
              {tickerItems.map((prod, idx) => (
                <Link
                  key={`${prod.id}-${idx}`}
                  href={`/product/${prod.id}`}
                  className="w-56 sm:w-64 flex-shrink-0 flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition duration-200"
                >
                  {/* Top card mini row */}
                  <div>
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-50 mb-2.5">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 rounded-md bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {prod.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition">
                      {prod.title}
                    </h4>

                    {prod.problemSolved && (
                      <p className="mt-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 line-clamp-1 font-medium">
                        💡 {prod.problemSolved}
                      </p>
                    )}
                  </div>

                  {/* Bottom price and verified seller */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900">
                        {formatPrice(prod.price)}
                      </span>
                      <p className="text-[9px] text-slate-400 truncate max-w-[120px]">
                        {prod.sellerName}
                      </p>
                    </div>
                    <span className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-2xs">
                      View
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-400 font-medium">
              💡 Hover on any product card above to pause the showcase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
