'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import HeroShowcase from './HeroShowcase';
import CatalogSection from './CatalogSection';
import Link from 'next/link';

interface HomeMarketplaceClientProps {
  products: Product[];
}

export default function HomeMarketplaceClient({ products }: HomeMarketplaceClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <div className="space-y-6">
      {/* 1. Distinctive, Original Moving Spotlight Showcase (No Jumia layout, no gradients, solid studio aesthetic) */}
      <HeroShowcase products={products} />

      {/* 2. Interactive Catalog with Live Instant Search & Filter */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-8">
        <CatalogSection
          initialProducts={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 3. Merchant Listing Callout */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xs">
          <div className="max-w-2xl space-y-2">
            <span className="inline-block rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              Merchant Concierge Service
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Have Stock to Sell in Uganda? We Connect You Directly with Buyers
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send us your photos on WhatsApp. We polish the images, create clean technical specs, verify your shop, and connect buyers straight to your phone for a small flat listing fee.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/sell"
                className="inline-block rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
              >
                View Listing Packages (from UGX 15,000)
              </Link>
              <a
                href="https://wa.me/256772123456?text=Hello%20ShidMagic%20Admin,%20I%20have%20stock%20I%20want%20to%20sell%20in%20Kampala"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Chat with Concierge Admin
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
