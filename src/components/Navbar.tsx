'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      {/* Top Notice Bar (Sleek Compact) */}
      <div className="bg-emerald-900 py-0.5 px-4 text-center text-[11px] font-semibold text-white">
        <span>Hand-reviewed listings from verified shops in Kampala • Direct WhatsApp ordering • MoMo on inspection</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Shid<span className="text-emerald-700">Magic</span>
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                UGANDA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none">Curated Merchant Showcase</p>
          </div>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            type="text"
            placeholder="Search solar, pumps, Starlink, phones, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1 rounded-md bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800 transition"
          >
            Find
          </button>
        </form>

        {/* Navigation CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/sell"
            className="rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-xs"
          >
            List Your Goods
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 font-bold text-xs border border-slate-200"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white p-3 space-y-2">
          <form onSubmit={handleSearch} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col gap-1.5 pt-1">
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-emerald-800 text-center px-3 py-2 text-xs font-bold text-white"
            >
              List Your Goods (From UGX 15,000)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
