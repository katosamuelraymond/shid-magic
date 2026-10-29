'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMarketplaceSearch } from '@/context/SearchContext';

const CATEGORIES = [
  { name: 'All', label: 'All Goods' },
  { name: 'Solar & Power Backup', label: 'Solar & Power Backup' },
  { name: 'Water & Home Tech', label: 'Water & Home Tech' },
  { name: 'Phones & Computers', label: 'Phones & Computers' },
  { name: 'Agri & Food Processing', label: 'Agri & Food Processing' },
  { name: 'Fashion & Beauty', label: 'Fashion & Beauty' },
  { name: 'Vehicles & Auto', label: 'Vehicles & Auto' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
  } = useMarketplaceSearch();
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

      {/* Mobile Integrated Search Bar with Category Filter Icon */}
      <div className="sm:hidden border-t border-slate-100 bg-white px-3 py-2 flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname !== '/') {
              router.push('/');
            }
          }}
          className="relative flex-1 flex items-center"
        >
          <Search className="h-4 w-4 text-emerald-800 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search solar, Starlink, iPhones..."
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

        {/* Filter Icon Button (Tapping brings categories) */}
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className={`p-2 rounded-xl border flex items-center justify-center transition flex-shrink-0 relative ${
            selectedCategory !== 'All'
              ? 'bg-emerald-800 border-emerald-900 text-white shadow-2xs'
              : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
          aria-label="Filter by category"
          title="Browse categories"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {selectedCategory !== 'All' && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* Mobile drawer for site links */}
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

      {/* Mobile Category Filter Drawer (Bottom Sheet) */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs sm:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative w-full rounded-t-2xl bg-white p-4 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Browse by Category</h3>
                <p className="text-[11px] text-slate-500">Select a category to filter listings instantly</p>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close category filter"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setIsFilterDrawerOpen(false);
                      if (pathname !== '/') router.push('/');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-emerald-700' : 'bg-slate-300'}`} />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setIsFilterDrawerOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Reset to All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 text-xs font-black text-white hover:bg-emerald-900 shadow-2xs"
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
