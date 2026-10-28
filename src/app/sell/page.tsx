import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  TrendingUp,
  Camera,
  MapPin,
  Clock,
  Flame,
} from 'lucide-react';

export default function SellPage() {
  const adminWhatsAppNumber = '256772123456';
  const whatsappSubmitLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
    'Hello Admin! I would like to list my goods for sale on ShidMagic. Here are my shop details and the items I want to upload.'
  )}`;
  const photoServiceLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
    'Hello ShidMagic Admin! I need your camera team to visit my shop in Kampala to take professional photos of my goods.'
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Assisted Merchant Concierge Program • Kampala, Uganda</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-4xl text-slate-900 max-w-2xl mx-auto leading-tight">
            Sell More Stock in Uganda Without Managing a Website
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Contact our concierge team on WhatsApp. We receive your items, take or polish photos, write clear technical specs, and connect buyers straight to your phone.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappSubmitLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-900 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact Admin on WhatsApp (0772 123 456)</span>
            </a>

            <a
              href={photoServiceLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
            >
              <Camera className="h-4 w-4 text-emerald-700" />
              <span>Book Camera Visit (Shop Photos)</span>
            </a>
          </div>
        </div>

        {/* 4 Simple Concierge Steps */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">How the Concierge Flow Works</h2>
            <p className="text-[11px] text-slate-500">Zero technical hassle. Our team handles everything for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-xs text-slate-900">Contact & Pay Listing Fee</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Contact our concierge admin on WhatsApp. Pay a small flat listing fee via MTN MoMo or Airtel Money.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-xs text-slate-900">Send Photos or Book Camera</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Send your photos, or request our photography team to visit your physical shop in Kampala for crisp, professional shots.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-xs text-slate-900">Admin Publishes Goods</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                We write problem-solving specs, verify your location, and publish your items with your direct telephone and WhatsApp links.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-xs text-slate-900">Keep Live / Renew Monthly</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Listings run for 30 days. When your period ends, simply renew to keep your products active and at the top!
              </p>
            </div>
          </div>
        </div>

        {/* Listing Fee Packages (Pricing) */}
        <div id="pricing" className="space-y-4 pt-2">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Listing Fee Packages</h2>
            <p className="text-xs text-slate-500">
              Pay a small flat fee. Zero sales commissions—you keep 100% of your money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starter</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Basic Listing</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">UGX 15,000</span>
                  <span className="text-[11px] text-slate-400">/ 30 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Great for moving single items quickly with direct WhatsApp inquiries.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Live on marketplace for 30 days</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Direct WhatsApp & Call Button to your phone</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Verified Merchant Badge</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg border border-slate-300 py-2.5 text-xs font-bold text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition"
                >
                  Choose Basic (UGX 15,000)
                </a>
              </div>
            </div>

            {/* Featured */}
            <div className="relative rounded-2xl border-2 border-emerald-700 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-800 px-2.5 py-0.5 text-[9px] font-black uppercase text-white">
                Most Popular
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Growth</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Featured Priority</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-800">UGX 25,000</span>
                  <span className="text-[11px] text-slate-400">/ 30 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Priority placement in search filters and enhanced multi-photo showcase.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Priority rank in search & department filters</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Multi-photo gallery cleanup & specs formatting</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Free WhatsApp status flyer generator</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                    <span>Direct WhatsApp & Call Button</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg bg-emerald-800 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-900 transition"
                >
                  Choose Featured (UGX 25,000)
                </a>
              </div>
            </div>

            {/* VIP Top Banner Spotlight */}
            <div className="rounded-2xl border-2 border-amber-400 bg-white p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Top Adverts</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">VIP Top Banner Spotlight</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-800">UGX 35,000</span>
                  <span className="text-[11px] text-slate-400">/ 30 days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Always pinned at the top in the auto-advancing hero banner adverts seen by every visitor.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span>Pinned directly in Top Hero Moving Spotlight Banner</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span>Highest visibility & maximum WhatsApp click inquiries</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span>Camera visit support in Kampala upon request</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span>Custom social media flyer + weekly performance report</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={whatsappSubmitLink}
                  className="block w-full text-center rounded-lg bg-amber-400 py-2.5 text-xs font-black text-slate-950 shadow-2xs hover:bg-amber-300 transition"
                >
                  Choose VIP Spotlight (UGX 35,000)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Photography Concierge Callout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold">
              <Camera className="h-3.5 w-3.5" />
              <span>Camera Visit Available in Kampala</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Can&apos;t Take Clean Photos Yourself? We Come to Your Shop
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your shop is located in Kampala CBD, Pioneer Mall, Nakasero, Acacia Mall, Ntinda, or surrounding areas, our concierge team can visit your physical shop with proper lighting to take crisp, high-resolution product photos.
            </p>
          </div>

          <a
            href={photoServiceLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 transition whitespace-nowrap self-start md:self-auto"
          >
            Request Shop Photography Visit &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
