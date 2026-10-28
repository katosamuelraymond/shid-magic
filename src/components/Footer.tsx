import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#04382a] bg-[#031d16] text-emerald-100/80">
      {/* 3 Pillars / Value Proposition Banner (Solid Deep Forest Obsidian) */}
      <div className="border-b border-[#053225] bg-[#02150f] py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-wider text-emerald-200 uppercase bg-[#064e3b] border border-emerald-600/60 px-2 py-0.5 rounded">
              Anti-Scam Guarantee
            </span>
            <h4 className="font-black text-xs sm:text-sm text-white pt-1">
              Physical Shop & ID Verified
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Zero ghost sellers. Every merchant is vetted with verified physical shop addresses in Pioneer Mall, Nakasero, and Acacia Mall Kampala.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-wider text-emerald-200 uppercase bg-[#064e3b] border border-emerald-600/60 px-2 py-0.5 rounded">
              Direct Contact
            </span>
            <h4 className="font-black text-xs sm:text-sm text-white pt-1">
              WhatsApp & Phone Communication
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Chat directly with the seller in real-time. Request product videos, ask questions, or arrange same-day delivery across Uganda.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-wider text-emerald-200 uppercase bg-[#064e3b] border border-emerald-600/60 px-2 py-0.5 rounded">
              Merchant Service
            </span>
            <h4 className="font-black text-xs sm:text-sm text-white pt-1">
              White-Glove Listing Concierge
            </h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Are you a merchant? Send us your photos on WhatsApp—we take care of technical specs, photo polish, and publish your items for a flat fee.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white font-black text-xs">
                S
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Shid<span className="text-amber-400">Magic</span> <span className="text-xs text-emerald-300 font-bold ml-1">UGANDA</span>
              </span>
            </div>
            <p className="text-xs text-emerald-100/70 max-w-sm leading-relaxed">
              The verified concierge marketplace connecting physical merchants in Kampala with serious buyers across Uganda. Safe, transparent, and direct.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2.5">
              Departments
            </h5>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/?category=Solar+%26+Power+Backup" className="hover:text-amber-300 transition">
                  Solar & Power Backup
                </Link>
              </li>
              <li>
                <Link href="/?category=Water+%26+Home+Tech" className="hover:text-amber-300 transition">
                  Water & Home Tech
                </Link>
              </li>
              <li>
                <Link href="/?category=Phones+%26+Computers" className="hover:text-amber-300 transition">
                  Phones & Computers
                </Link>
              </li>
              <li>
                <Link href="/?category=Agri+%26+Food+Processing" className="hover:text-amber-300 transition">
                  Agri & Food Processing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2.5">
              For Merchants
            </h5>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/sell" className="hover:text-amber-300 transition">
                  List Your Goods (Packages)
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-amber-300 transition">
                  Merchant Live Views Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/256772123456?text=Hello%20ShidMagic%20Admin,%20I%20want%20to%20list%20my%20products%20on%20your%20marketplace"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition"
                >
                  Contact Concierge Desk (WhatsApp)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#053225] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-200/50">
          <p>&copy; {new Date().getFullYear()} ShidMagic Marketplace Uganda. All rights reserved.</p>
          <p>Curated Concierge Commerce Platform.</p>
        </div>
      </div>
    </footer>
  );
}
