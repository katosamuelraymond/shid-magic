'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-2xs">
      {/* Top Notice Bar */}
      <div className="bg-[#064e3b] py-1 px-4 text-center text-[11px] font-semibold text-emerald-100 border-b border-[#04382a]">
        <span>Verified Kampala physical shops • Direct WhatsApp ordering • MoMo payment on inspection</span>
      </div>

      <div className="mx-auto flex max-w-7xl h-[52px] items-center justify-between gap-4 px-4 sm:px-6">
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

        {/* Center Trust Value Badges (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <span className="text-emerald-700 font-bold">●</span> Pioneer Mall & Acacia Verified
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-700 font-bold">●</span> Chat Seller on WhatsApp
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-700 font-bold">●</span> Real In-Person Inspection
          </span>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/merchant"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
            title="Check your real buyer views and leads"
          >
            <span>Merchant Views Portal</span>
          </Link>

          <Link
            href="/sell"
            className="rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-black text-white hover:bg-emerald-900 transition shadow-2xs"
          >
            List Your Goods
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 font-bold text-xs border border-slate-200"
          >
            {mobileMenuOpen ? '✕' : 'Menu'}
          </button>
        </div>
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
