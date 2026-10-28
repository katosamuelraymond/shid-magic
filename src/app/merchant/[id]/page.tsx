import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getSellerById,
  getAllProducts,
} from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import {
  Eye,
  MessageCircle,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';

interface MerchantPageProps {
  params: Promise<{ id: string }>;
}

export default async function MerchantProfilePage({ params }: MerchantPageProps) {
  const { id } = await params;
  const seller = getSellerById(id);

  if (!seller) {
    notFound();
  }

  // Fetch all products of this seller (including inactive/suspended so the merchant sees full status)
  const allSellerProducts = getAllProducts({
    sellerId: seller.id,
    includeHidden: true,
  });

  const totalViews = allSellerProducts.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalLeads = allSellerProducts.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0);
  const totalCalls = allSellerProducts.reduce((acc, p) => acc + (p.callClicks || 0), 0);
  const activeProducts = allSellerProducts.filter((p) => p.status === 'active');
  const suspendedProducts = allSellerProducts.filter((p) => p.status === 'suspended');

  const now = new Date().getTime();
  const expiry = new Date(seller.subscriptionExpiresAt).getTime();
  const isExpired = expiry <= now;
  const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  const adminWhatsAppNumber = '256772123456';
  const renewWhatsAppLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
    `Hello ShidMagic Admin, I am ${seller.name} from ${seller.businessName || seller.location}. I want to renew my ${seller.packagePlan} listing subscription period.`
  )}`;
  const addStockWhatsAppLink = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
    `Hello ShidMagic Admin, I am ${seller.name} from ${seller.businessName || seller.location}. I have new stock I want to upload to my ShidMagic shop.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-600">
            Client ID: {seller.id}
          </span>
        </div>

        {/* Header Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white font-black text-2xl shadow-sm flex-shrink-0">
                {seller.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {seller.businessName || seller.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Merchant
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Proprietor: {seller.name}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{seller.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono">{seller.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Renewal Badge */}
            <div className="sm:text-right flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider ${
                  seller.status === 'suspended'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {seller.status === 'suspended' ? '● Suspended / Hidden' : '● Online & Active'}
              </span>

              <div className="mt-1 text-xs">
                {isExpired ? (
                  <span className="font-bold text-rose-600 flex items-center gap-1 sm:justify-end">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Subscription Expired</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 sm:justify-end">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{daysRemaining} Days Remaining</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Alert if expired / suspended */}
          {seller.status === 'suspended' && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Your goods are currently hidden from public view</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Your listing subscription period has expired. Renew your plan to immediately restore all your goods back online for buyers across Uganda.
              </p>
              <div className="pt-1">
                <a
                  href={renewWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-lg bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800 transition"
                >
                  Renew Subscription via WhatsApp / MoMo &rarr;
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Live Performance Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Real Views
              </span>
              <Eye className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Real buyer impressions</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WhatsApp Inquiries
              </span>
              <MessageCircle className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {totalLeads.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Taps to your WhatsApp chat</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Direct Phone Calls
              </span>
              <Phone className="h-4 w-4 text-slate-600" />
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {totalCalls.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Call clicks from buyers</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Active Listings
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            </div>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {activeProducts.length} Online
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">{allSellerProducts.length} total listed</p>
          </div>
        </div>

        {/* Product Breakdown Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Your Product Views Breakdown</h2>
              <p className="text-xs text-slate-500">
                Track how each individual product is performing in real-time.
              </p>
            </div>

            <a
              href={addStockWhatsAppLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-900 transition self-start sm:self-auto"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Request Admin to Add More Goods</span>
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {allSellerProducts.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No products uploaded yet for this shop.
              </p>
            ) : (
              allSellerProducts.map((prod) => (
                <div key={prod.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="h-12 w-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/product/${prod.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-1"
                      >
                        {prod.title}
                      </Link>
                      <p className="text-xs font-black text-slate-800 mt-0.5">
                        {formatPrice(prod.price)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {prod.category} • {prod.condition}
                      </p>
                    </div>
                  </div>

                  {/* Views & Inquiries metrics for this product */}
                  <div className="flex items-center gap-4 self-end sm:self-auto flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block flex items-center justify-end gap-1">
                        <Eye className="h-3 w-3 text-emerald-700" />
                        <span>{prod.viewsCount || 0}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Views</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700 block flex items-center justify-end gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{prod.whatsappClicks || 0}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Leads</span>
                    </div>

                    <div>
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                          prod.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {prod.status.toUpperCase()}
                      </span>
                    </div>

                    <Link
                      href={`/product/${prod.id}`}
                      target="_blank"
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-700 transition"
                      title="View on Live Marketplace"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Merchant Support Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div>
            <p className="font-bold text-slate-900">Need Assistance with Your Listing?</p>
            <p className="text-slate-500">Contact the ShidMagic Operations Admin directly on WhatsApp for renewals, photo updates, or price changes.</p>
          </div>
          <a
            href={renewWhatsAppLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-emerald-800 px-4 py-2 font-bold text-white hover:bg-emerald-900 transition whitespace-nowrap self-start sm:self-auto"
          >
            Chat with Admin (0772 123 456)
          </a>
        </div>
      </div>
    </div>
  );
}
