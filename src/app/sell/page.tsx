import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function SellPage() {
  const adminWhatsAppNumber = '254712345678';
  const whatsappSubmitLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
    'Hello Admin! I would like to list my goods for sale on ShidMagic. Here are my shop details and the items I want to upload.'
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Assisted Merchant Concierge Program</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-4xl text-slate-900 max-w-2xl mx-auto leading-tight">
            Sell More Goods Without the Stress of Managing a Website
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Send us your photos and prices via WhatsApp. Our admin team polishes your images, creates the listing, and connects serious buyers directly to your phone.
          </p>

          <div className="pt-2">
            <a
              href={whatsappSubmitLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Submit Goods to Admin on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 4 Simple Steps */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">How It Works in 4 Steps</h2>
            <p className="text-[11px] text-slate-500">Zero technical knowledge needed. We do the work for you.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-xs text-slate-900">Send Photos on WhatsApp</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Take pictures of your goods with your phone. Send them to our admin with your asking price and location.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-xs text-slate-900">Admin Polish & Verification</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                We enhance your photos, write clear technical specs, and verify your shop address to build buyer trust.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-xs text-slate-900">Published to Buyers</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your goods appear on the marketplace with your phone number and direct WhatsApp order button.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-xs text-slate-900">Direct Inquiries & Reports</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Buyers message you directly. We send you WhatsApp performance reports showing your views and clicks.
              </p>
            </div>
          </div>
        </div>

        {/* Listing Fee Packages (Pricing) */}
        <div id="pricing" className="space-y-4 pt-2">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Transparent Listing Packages</h2>
            <p className="text-xs text-slate-500">Pay a small one-time listing fee. Keep 100% of your sales price.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starter</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Basic Listing</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">$15</span>
                  <span className="text-[11px] text-slate-400">/ 30 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Great for moving single items quickly with zero hassle.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Live on marketplace for 30 days</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Direct WhatsApp & Call Button</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Verified Merchant Badge</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg border border-slate-300 py-2 text-xs font-bold text-slate-800 hover:border-emerald-600 hover:text-emerald-600 transition"
                >
                  Choose Basic ($15)
                </a>
              </div>
            </div>

            {/* Featured */}
            <div className="relative rounded-2xl border-2 border-emerald-600 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-black uppercase text-white">
                Most Popular
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Growth</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Featured Deal</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-600">$25</span>
                  <span className="text-[11px] text-slate-400">/ 45 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Priority placement on the homepage and at the top of category searches.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Homepage "Hot Deals" showcase</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Pinned at top of category search</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Photo cleanup & multi-photo gallery</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Direct WhatsApp & Call Button</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                >
                  Choose Featured ($25)
                </a>
              </div>
            </div>

            {/* VIP */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">High Volume</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">VIP Showcase</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">$35</span>
                  <span className="text-[11px] text-slate-400">/ 60 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Full service: custom social media flyers and weekly WhatsApp performance reports.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Everything in Featured Deal</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Custom Instagram & WhatsApp Status flyer</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Weekly WhatsApp performance reports</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg border border-slate-300 py-2 text-xs font-bold text-slate-800 hover:border-emerald-600 hover:text-emerald-600 transition"
                >
                  Choose VIP ($35)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
