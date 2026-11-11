'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import HeroShowcase from './HeroShowcase';
import CatalogSection from './CatalogSection';
import Link from 'next/link';
import { Building2, MessageCircle, ShieldCheck, ArrowRight, Banknote } from 'lucide-react';

interface HomeMarketplaceClientProps {
  products: Product[];
}

export default function HomeMarketplaceClient({ products }: HomeMarketplaceClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <div className="space-y-6">
      {/* 1. Moving Spotlight Showcase */}
      <HeroShowcase products={products} />

      {/* 2. High-Converting Merchant Onboarding Callout (Income Engine) */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-emerald-900/30 bg-[#042f24] p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-800 border border-emerald-600/50 px-2.5 py-0.5 text-xs font-bold text-emerald-100 uppercase tracking-wide">
                Merchant Listing Service
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Pioneer Mall • Nakasero • Acacia Mall
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Own a Physical Shop in Kampala? Sell Stock Directly to Verified Buyers
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              We visit your shop, photograph your goods, craft high-converting technical specs, and route buyer inquiries straight to your WhatsApp for a small flat monthly listing fee.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition shadow-xs"
            >
              <span>List Your Shop (From UGX 15k)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/256772123456?text=Hello%20ShidMagic%20Admin,%20I%20have%20stock%20I%20want%20to%20sell%20in%20Kampala"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/70 bg-transparent px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
            >
              <MessageCircle className="h-4 w-4 text-emerald-300" />
              <span>Chat with Admin</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Interactive Catalog with Live Instant Search & Filter */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-8">
        <CatalogSection
          initialProducts={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </main>
    </div>
  );
}
