'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useMarketplaceSearch } from '@/context/SearchContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useMarketplaceSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render the public marketplace navbar inside the admin dashboard shell
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-2xs">
      {/* Top Notice Bar */}
      <div className="bg-[#064e3b] py-1 px-4 text-center text-[11px] font-semibold text-emerald-100 border-b border-[#04382a] truncate">
        <span>Verified Kampala physical shops • Direct WhatsApp ordering • MoMo payment on inspection</span>
      </div>

      <div className="mx-auto flex max-w-7xl h-[52px] items-center justify-between gap-3 px-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white font-black text-base">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                Shid<span className="text-emerald-700">Magic</span>
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                UGANDA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Concierge Goods Marketplace</p>
          </div>
        </Link>

        {/* Universal Desktop Search Bar in Navbar */}
        <div className="hidden sm:flex flex-1 max-w-lg mx-3 lg:mx-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pathname !== '/') router.push('/');
            }}
            className="relative w-full flex items-center"
          >
            <Search className="h-4 w-4 text-emerald-800 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search solar generators, booster pumps, Starlink, iPhones..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (pathname !== '/') router.push('/');
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/merchant"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
            title="Check your real buyer views and leads"
          >
            <span>Merchant Portal</span>
          </Link>

          <Link
            href="/sell"
            className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-900 transition shadow-2xs whitespace-nowrap"
          >
            List Goods
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 font-bold text-xs border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Integrated Search Bar (Always visible on phone screens in the navbar) */}
      <div className="sm:hidden border-t border-slate-100 bg-white px-3 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname !== '/') {
              router.push('/');
            }
          }}
          className="relative flex items-center"
        >
          <Search className="h-4 w-4 text-emerald-800 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search solar, Starlink, iPhones, water pumps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (pathname !== '/') {
                router.push('/');
              }
            }}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white p-3 space-y-2 shadow-lg">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg bg-emerald-800 text-center px-3 py-2 text-xs font-bold text-white"
            >
              List Your Goods (From UGX 15,000)
            </Link>

            <Link
              href="/merchant"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg border border-slate-200 bg-slate-50 text-center px-3 py-2 text-xs font-bold text-slate-800"
            >
              Merchant Live Views Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
