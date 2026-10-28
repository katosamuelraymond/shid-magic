'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Store, ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function MerchantLookupPage() {
  const [query, setQuery] = useState('');
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('/api/sellers');
      const data = await res.json();
      if (data.success) {
        const q = query.trim().toLowerCase();
        const matches = data.sellers.filter(
          (s: any) =>
            s.phone.includes(q) ||
            s.whatsappNumber.includes(q) ||
            s.name.toLowerCase().includes(q) ||
            (s.businessName && s.businessName.toLowerCase().includes(q))
        );
        setSellers(matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="text-center space-y-1.5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold mb-2">
              <Store className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Merchant Live Views Portal
            </h1>
            <p className="text-xs text-slate-500">
              Enter your registered phone number or business name to view your live buyer views, WhatsApp leads, and listing status.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter phone number (e.g. 0772123456) or shop name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-900 focus:border-emerald-700 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-800 py-3 text-xs font-bold text-white hover:bg-emerald-900 transition disabled:opacity-50 shadow-xs"
            >
              {loading ? 'Searching...' : 'Find My Live Performance Dashboard'}
            </button>
          </form>

          {searched && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Found {sellers.length} registered merchant(s):
              </p>

              {sellers.length === 0 ? (
                <div className="rounded-lg bg-slate-50 p-4 text-center text-xs text-slate-500">
                  No matching merchant found. Contact the admin on WhatsApp if you have recently registered.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sellers.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.businessName || s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.location} • {s.phone}</p>
                      </div>

                      <Link
                        href={`/merchant/${s.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
                      >
                        <span>Open Stats</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
