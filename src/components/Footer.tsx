import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* 3 Pillars / Value Proposition Banner (Solid) */}
      <div className="border-b border-slate-200 bg-slate-50 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
              Anti-Scam Guarantee
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 pt-1">
              Physical Shop & ID Verified
            </h4>
            <p className="text-xs text-slate-500">
              Zero ghost sellers. Every merchant is vetted with verified physical shop addresses on Kampala Road, Acacia Mall, and Nakasero.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
              Direct Contact
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 pt-1">
              WhatsApp & Phone Communication
            </h4>
            <p className="text-xs text-slate-500">
              Chat directly with the seller in real-time. Request videos, ask questions, or arrange same-day delivery.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
              Merchant Service
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 pt-1">
              White-Glove Listing Service
            </h4>
            <p className="text-xs text-slate-500">
              Are you a merchant? Send us your photos on WhatsApp—we write technical specs and publish your items for a small listing fee.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs">
                S
              </div>
              <span className="text-base font-black tracking-tight text-slate-900">
                Shid<span className="text-emerald-700">Magic</span> Uganda
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              The verified concierge marketplace connecting physical merchants in Kampala with serious buyers across Uganda. Safe, transparent, and direct.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">Departments</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <Link href="/?category=Solar+%26+Power+Backup" className="hover:text-emerald-700 transition">
                  Solar & Power Backup
                </Link>
              </li>
              <li>
                <Link href="/?category=Water+%26+Home+Tech" className="hover:text-emerald-700 transition">
                  Water & Home Tech
                </Link>
              </li>
              <li>
                <Link href="/?category=Phones+%26+Computers" className="hover:text-emerald-700 transition">
                  Phones & Computers
                </Link>
              </li>
              <li>
                <Link href="/?category=Agri+%26+Food+Processing" className="hover:text-emerald-700 transition">
                  Agri & Food Processing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">Merchants & Admin</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <Link href="/sell" className="hover:text-emerald-700 transition">
                  List Your Goods
                </Link>
              </li>
              <li>
                <Link href="/sell#pricing" className="hover:text-emerald-700 transition">
                  Listing Fee Pricing
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-700 transition">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>&copy; {new Date().getFullYear()} ShidMagic Marketplace Uganda. All rights reserved.</p>
          <p>Assisted Commerce Platform.</p>
        </div>
      </div>
    </footer>
  );
}
